// Configuração da API
const API_BASE = window.location.origin + '/api';

// Estado da aplicação
let currentPage = 1;
let currentCategory = '';
let currentSearch = '';
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let selectedProduct = null;

// Elementos DOM
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    navMenu: document.getElementById('navMenu'),
    featuredProducts: document.getElementById('featuredProducts'),
    saleProducts: document.getElementById('saleProducts'),
    allProducts: document.getElementById('allProducts'),
    pagination: document.getElementById('pagination'),
    cartBtn: document.getElementById('cartBtn'),
    cartBadge: document.getElementById('cartBadge'),
    cartSidebar: document.getElementById('cartSidebar'),
    cartContent: document.getElementById('cartContent'),
    cartTotal: document.getElementById('cartTotal'),
    closeCart: document.getElementById('closeCart'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    productModal: document.getElementById('productModal'),
    closeModal: document.getElementById('closeModal'),
    overlay: document.getElementById('overlay'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notificationText'),
    favoritesBadge: document.getElementById('favoritesBadge')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    loadFeaturedProducts();
    loadSaleProducts();
    loadProducts();
    updateCartBadge();
    updateFavoritesBadge();
}

function setupEventListeners() {
    // Busca
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Navegação por categorias
    elements.navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            e.preventDefault();
            handleCategoryChange(e.target);
        }
    });

    // Carrinho
    elements.cartBtn.addEventListener('click', toggleCart);
    elements.closeCart.addEventListener('click', closeCart);

    // Modal
    elements.closeModal.addEventListener('click', closeModal);
    elements.overlay.addEventListener('click', function() {
        closeCart();
        closeModal();
    });

    // Checkout
    elements.checkoutBtn.addEventListener('click', handleCheckout);

    // Modal de produto
    setupProductModal();
}

// Funções de API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Erro ao carregar dados', 'error');
        return null;
    }
}

// Carregamento de produtos
async function loadFeaturedProducts() {
    const data = await apiRequest('/products/featured');
    if (data) {
        renderProducts(data, elements.featuredProducts);
    }
}

async function loadSaleProducts() {
    const data = await apiRequest('/products/on-sale');
    if (data) {
        renderProducts(data, elements.saleProducts);
    }
}

async function loadProducts(page = 1, category = '', search = '') {
    showLoading(elements.allProducts);
    
    let endpoint = `/products?page=${page}&per_page=12`;
    if (category) endpoint += `&category_id=${category}`;
    if (search) endpoint += `&search=${encodeURIComponent(search)}`;
    
    const data = await apiRequest(endpoint);
    if (data) {
        renderProducts(data.products, elements.allProducts);
        renderPagination(data.pagination);
    }
}

// Renderização de produtos
function renderProducts(products, container) {
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="loading">Nenhum produto encontrado</div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}" loading="lazy">
                ${product.is_featured ? '<span class="product-badge badge-featured">Destaque</span>' : ''}
                ${product.is_on_sale ? '<span class="product-badge badge-sale">Promoção</span>' : ''}
                <button class="product-favorite ${favorites.includes(product.id) ? 'active' : ''}" 
                        data-product-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category_name}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">R$ ${formatPrice(product.price)}</span>
                    ${product.original_price ? `<span class="original-price">R$ ${formatPrice(product.original_price)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Adicionar
                    </button>
                    <button class="favorite-btn ${favorites.includes(product.id) ? 'active' : ''}" 
                            data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Adicionar event listeners
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.product-actions') && !e.target.closest('.product-favorite')) {
                const productId = this.dataset.productId;
                openProductModal(productId);
            }
        });
    });

    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.productId;
            addToCart(productId, 1);
        });
    });

    container.querySelectorAll('.favorite-btn, .product-favorite').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.dataset.productId;
            toggleFavorite(productId);
        });
    });
}

// Paginação
function renderPagination(pagination) {
    if (!pagination || pagination.total_pages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Botão anterior
    if (pagination.page > 1) {
        paginationHTML += `<button class="page-btn" data-page="${pagination.page - 1}">Anterior</button>`;
    }

    // Páginas
    for (let i = 1; i <= pagination.total_pages; i++) {
        if (i === pagination.page) {
            paginationHTML += `<button class="page-btn active" data-page="${i}">${i}</button>`;
        } else if (i === 1 || i === pagination.total_pages || Math.abs(i - pagination.page) <= 2) {
            paginationHTML += `<button class="page-btn" data-page="${i}">${i}</button>`;
        } else if (i === pagination.page - 3 || i === pagination.page + 3) {
            paginationHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    // Botão próximo
    if (pagination.page < pagination.total_pages) {
        paginationHTML += `<button class="page-btn" data-page="${pagination.page + 1}">Próximo</button>`;
    }

    elements.pagination.innerHTML = paginationHTML;

    // Event listeners para paginação
    elements.pagination.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            currentPage = page;
            loadProducts(page, currentCategory, currentSearch);
        });
    });
}

// Busca
function handleSearch() {
    const searchTerm = elements.searchInput.value.trim();
    currentSearch = searchTerm;
    currentPage = 1;
    loadProducts(1, currentCategory, searchTerm);
}

// Navegação por categorias
function handleCategoryChange(link) {
    // Remover classe active de todos os links
    elements.navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Adicionar classe active ao link clicado
    link.classList.add('active');
    
    // Atualizar categoria atual
    currentCategory = link.dataset.category;
    currentPage = 1;
    
    // Carregar produtos da categoria
    loadProducts(1, currentCategory, currentSearch);
}

// Carrinho de compras
async function addToCart(productId, quantity = 1) {
    const data = await apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({
            product_id: parseInt(productId),
            quantity: quantity
        })
    });

    if (data) {
        showNotification('Produto adicionado ao carrinho!');
        updateCartBadge();
    }
}

async function loadCart() {
    const data = await apiRequest('/cart');
    if (data) {
        renderCart(data);
        updateCartBadge(data.count);
    }
}

function renderCart(cartData) {
    if (!cartData.items || cartData.items.length === 0) {
        elements.cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
            </div>
        `;
        elements.cartTotal.textContent = '0,00';
        return;
    }

    elements.cartContent.innerHTML = cartData.items.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image_url}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${formatPrice(item.price)}</div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn decrease-qty" data-item-id="${item.id}">-</button>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                               data-item-id="${item.id}">
                        <button class="qty-btn increase-qty" data-item-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-item-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    elements.cartTotal.textContent = formatPrice(cartData.total);

    // Event listeners para controles do carrinho
    setupCartControls();
}

function setupCartControls() {
    elements.cartContent.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const input = elements.cartContent.querySelector(`input[data-item-id="${itemId}"]`);
            const newQty = parseInt(input.value) + 1;
            updateCartItemQuantity(itemId, newQty);
        });
    });

    elements.cartContent.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const input = elements.cartContent.querySelector(`input[data-item-id="${itemId}"]`);
            const newQty = Math.max(1, parseInt(input.value) - 1);
            updateCartItemQuantity(itemId, newQty);
        });
    });

    elements.cartContent.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', function() {
            const itemId = this.dataset.itemId;
            const newQty = Math.max(1, parseInt(this.value));
            updateCartItemQuantity(itemId, newQty);
        });
    });

    elements.cartContent.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            removeFromCart(itemId);
        });
    });
}

async function updateCartItemQuantity(itemId, quantity) {
    const data = await apiRequest('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({
            id: parseInt(itemId),
            quantity: quantity
        })
    });

    if (data) {
        loadCart();
    }
}

async function removeFromCart(itemId) {
    const data = await apiRequest('/cart/remove', {
        method: 'DELETE',
        body: JSON.stringify({
            id: parseInt(itemId)
        })
    });

    if (data) {
        showNotification('Item removido do carrinho');
        loadCart();
    }
}

async function updateCartBadge(count = null) {
    if (count === null) {
        const data = await apiRequest('/cart');
        count = data ? data.count : 0;
    }
    elements.cartBadge.textContent = count;
}

function toggleCart() {
    if (elements.cartSidebar.classList.contains('open')) {
        closeCart();
    } else {
        openCart();
    }
}

function openCart() {
    elements.cartSidebar.classList.add('open');
    elements.overlay.classList.add('open');
    loadCart();
}

function closeCart() {
    elements.cartSidebar.classList.remove('open');
    elements.overlay.classList.remove('open');
}

// Favoritos
function toggleFavorite(productId) {
    const id = parseInt(productId);
    const index = favorites.indexOf(id);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removido dos favoritos');
    } else {
        favorites.push(id);
        showNotification('Adicionado aos favoritos');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesBadge();
    
    // Atualizar botões de favorito na página
    document.querySelectorAll(`[data-product-id="${id}"]`).forEach(btn => {
        if (btn.classList.contains('favorite-btn') || btn.classList.contains('product-favorite')) {
            btn.classList.toggle('active', favorites.includes(id));
        }
    });
}

function updateFavoritesBadge() {
    elements.favoritesBadge.textContent = favorites.length;
}

// Modal de produto
function setupProductModal() {
    const modalElements = {
        decreaseQty: document.getElementById('decreaseQty'),
        increaseQty: document.getElementById('increaseQty'),
        modalQuantity: document.getElementById('modalQuantity'),
        modalAddToCart: document.getElementById('modalAddToCart'),
        modalFavorite: document.getElementById('modalFavorite')
    };

    modalElements.decreaseQty.addEventListener('click', function() {
        const qty = Math.max(1, parseInt(modalElements.modalQuantity.value) - 1);
        modalElements.modalQuantity.value = qty;
    });

    modalElements.increaseQty.addEventListener('click', function() {
        const qty = parseInt(modalElements.modalQuantity.value) + 1;
        modalElements.modalQuantity.value = qty;
    });

    modalElements.modalAddToCart.addEventListener('click', function() {
        if (selectedProduct) {
            const quantity = parseInt(modalElements.modalQuantity.value);
            addToCart(selectedProduct.id, quantity);
            closeModal();
        }
    });

    modalElements.modalFavorite.addEventListener('click', function() {
        if (selectedProduct) {
            toggleFavorite(selectedProduct.id);
            this.classList.toggle('active', favorites.includes(selectedProduct.id));
        }
    });
}

async function openProductModal(productId) {
    // Buscar dados do produto (simulado - em uma implementação real, faria uma requisição à API)
    const allProductsData = await apiRequest('/products?per_page=100');
    const product = allProductsData.products.find(p => p.id == productId);
    
    if (!product) return;
    
    selectedProduct = product;
    
    // Preencher modal
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductImage').src = product.image_url;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalCurrentPrice').textContent = `R$ ${formatPrice(product.price)}`;
    
    const originalPriceEl = document.getElementById('modalOriginalPrice');
    if (product.original_price) {
        originalPriceEl.textContent = `R$ ${formatPrice(product.original_price)}`;
        originalPriceEl.style.display = 'inline';
    } else {
        originalPriceEl.style.display = 'none';
    }
    
    document.getElementById('modalQuantity').value = 1;
    
    const favoriteBtn = document.getElementById('modalFavorite');
    favoriteBtn.classList.toggle('active', favorites.includes(product.id));
    
    // Mostrar modal
    elements.productModal.classList.add('open');
    elements.overlay.classList.add('open');
}

function closeModal() {
    elements.productModal.classList.remove('open');
    elements.overlay.classList.remove('open');
    selectedProduct = null;
}

// Checkout
function handleCheckout() {
    showNotification('Funcionalidade de checkout em desenvolvimento');
}

// Utilitários
function formatPrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',');
}

function showLoading(container) {
    container.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i> Carregando...</div>';
}

function showNotification(message, type = 'success') {
    elements.notificationText.textContent = message;
    elements.notification.className = `notification ${type}`;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}


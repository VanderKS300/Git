// API Base URL
const API_BASE = '/api';

// Global state
let currentSection = 'dashboard';
let stocksData = [];
let newsData = [];
let glossaryData = [];
let suggestionsData = [];

// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const globalSearch = document.getElementById('global-search');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
});

function initializeApp() {
    // Set active section based on hash or default to dashboard
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    } else {
        showSection('dashboard');
    }
}

function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            showSection(section);
            window.location.hash = section;
        });
    });

    // Global search
    globalSearch.addEventListener('input', debounce(handleGlobalSearch, 300));

    // Section-specific search and filters
    setupStocksEventListeners();
    setupNewsEventListeners();
    setupGlossaryEventListeners();
    setupSuggestionsEventListeners();

    // Modals
    setupModalEventListeners();
}

function showSection(sectionId) {
    // Hide all sections
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    const targetNavLink = document.querySelector(`[data-section="${sectionId}"]`);
    
    if (targetSection && targetNavLink) {
        targetSection.classList.add('active');
        targetNavLink.classList.add('active');
        currentSection = sectionId;

        // Load section data if needed
        switch (sectionId) {
            case 'stocks':
                loadStocksData();
                break;
            case 'news':
                loadNewsData();
                break;
            case 'glossary':
                loadGlossaryData();
                break;
            case 'suggestions':
                loadSuggestionsData();
                break;
        }
    }
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        showLoading();
        
        // Load top gainers and losers
        await Promise.all([
            loadTopGainers(),
            loadTopLosers(),
            loadRecentNews()
        ]);
        
        hideLoading();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        hideLoading();
    }
}

async function loadTopGainers() {
    try {
        const response = await fetch(`${API_BASE}/stocks/top-gainers?limit=5`);
        const data = await response.json();
        
        if (data.success) {
            renderStockList(data.data, 'top-gainers');
        }
    } catch (error) {
        console.error('Error loading top gainers:', error);
        document.getElementById('top-gainers').innerHTML = '<div class="error">Erro ao carregar dados</div>';
    }
}

async function loadTopLosers() {
    try {
        const response = await fetch(`${API_BASE}/stocks/top-losers?limit=5`);
        const data = await response.json();
        
        if (data.success) {
            renderStockList(data.data, 'top-losers');
        }
    } catch (error) {
        console.error('Error loading top losers:', error);
        document.getElementById('top-losers').innerHTML = '<div class="error">Erro ao carregar dados</div>';
    }
}

async function loadRecentNews() {
    try {
        const response = await fetch(`${API_BASE}/news?limit=3`);
        const data = await response.json();
        
        if (data.success) {
            renderNewsList(data.data, 'recent-news');
        }
    } catch (error) {
        console.error('Error loading recent news:', error);
        document.getElementById('recent-news').innerHTML = '<div class="error">Erro ao carregar notícias</div>';
    }
}

function renderStockList(stocks, containerId) {
    const container = document.getElementById(containerId);
    
    if (!stocks || stocks.length === 0) {
        container.innerHTML = '<div class="no-data">Nenhum dado disponível</div>';
        return;
    }
    
    const html = stocks.map(stock => `
        <div class="stock-item" onclick="showStockDetails('${stock.symbol}')">
            <div class="stock-info">
                <div class="stock-symbol">${stock.symbol}</div>
                <div class="stock-name">${stock.shortName || stock.longName || 'N/A'}</div>
            </div>
            <div class="stock-price">
                <div class="stock-value">R$ ${formatNumber(stock.regularMarketPrice)}</div>
                <div class="stock-change ${stock.regularMarketChangePercent >= 0 ? 'positive' : 'negative'}">
                    ${stock.regularMarketChangePercent >= 0 ? '+' : ''}${formatNumber(stock.regularMarketChangePercent)}%
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function renderNewsList(news, containerId) {
    const container = document.getElementById(containerId);
    
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="no-data">Nenhuma notícia disponível</div>';
        return;
    }
    
    const html = news.map(article => `
        <div class="news-item-small" onclick="openNewsLink('${article.articleUrl}')">
            <div class="news-title">${article.title}</div>
            <div class="news-meta">
                <span class="news-source">${article.source || 'Fonte não informada'}</span>
                <span>${formatDate(article.publishDate)}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Stocks Functions
function setupStocksEventListeners() {
    const stockSearch = document.getElementById('stock-search');
    const sectorFilter = document.getElementById('sector-filter');
    const sortFilter = document.getElementById('sort-filter');
    const orderFilter = document.getElementById('order-filter');

    if (stockSearch) {
        stockSearch.addEventListener('input', debounce(filterStocks, 300));
    }
    
    [sectorFilter, sortFilter, orderFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterStocks);
        }
    });
}

async function loadStocksData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/stocks`);
        const data = await response.json();
        
        if (data.success) {
            stocksData = data.data;
            renderStocksTable(stocksData);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading stocks data:', error);
        hideLoading();
    }
}

function renderStocksTable(stocks) {
    const tbody = document.getElementById('stocks-table-body');
    
    if (!stocks || stocks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma ação encontrada</td></tr>';
        return;
    }
    
    const html = stocks.map(stock => `
        <tr>
            <td><strong>${stock.symbol}</strong></td>
            <td>${stock.shortName || stock.longName || 'N/A'}</td>
            <td>R$ ${formatNumber(stock.regularMarketPrice)}</td>
            <td class="${stock.regularMarketChangePercent >= 0 ? 'positive' : 'negative'}">
                ${stock.regularMarketChangePercent >= 0 ? '+' : ''}${formatNumber(stock.regularMarketChangePercent)}%
            </td>
            <td>${formatNumber(stock.regularMarketVolume)}</td>
            <td>
                <button class="stock-action-btn" onclick="showStockDetails('${stock.symbol}')">
                    Ver Detalhes
                </button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

function filterStocks() {
    const searchTerm = document.getElementById('stock-search')?.value.toLowerCase() || '';
    const sector = document.getElementById('sector-filter')?.value || '';
    const sortBy = document.getElementById('sort-filter')?.value || 'symbol';
    const order = document.getElementById('order-filter')?.value || 'asc';
    
    let filteredStocks = stocksData.filter(stock => {
        const matchesSearch = !searchTerm || 
            stock.symbol.toLowerCase().includes(searchTerm) ||
            (stock.shortName && stock.shortName.toLowerCase().includes(searchTerm)) ||
            (stock.longName && stock.longName.toLowerCase().includes(searchTerm));
        
        const matchesSector = !sector || stock.sector === sector;
        
        return matchesSearch && matchesSector;
    });
    
    // Sort stocks
    filteredStocks.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (order === 'desc') {
            return bVal > aVal ? 1 : -1;
        } else {
            return aVal > bVal ? 1 : -1;
        }
    });
    
    renderStocksTable(filteredStocks);
}

// News Functions
function setupNewsEventListeners() {
    const categoryFilter = document.getElementById('news-category-filter');
    const expertFilter = document.getElementById('news-expert-filter');
    
    [categoryFilter, expertFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterNews);
        }
    });
}

async function loadNewsData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/news`);
        const data = await response.json();
        
        if (data.success) {
            newsData = data.data;
            renderNewsGrid(newsData);
            await loadNewsFilters();
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading news data:', error);
        hideLoading();
    }
}

async function loadNewsFilters() {
    try {
        // Load categories
        const categoriesResponse = await fetch(`${API_BASE}/news/categories`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
            populateSelect('news-category-filter', categoriesData.data);
        }
        
        // Load experts
        const expertsResponse = await fetch(`${API_BASE}/news/experts`);
        const expertsData = await expertsResponse.json();
        
        if (expertsData.success) {
            populateSelect('news-expert-filter', expertsData.data);
        }
    } catch (error) {
        console.error('Error loading news filters:', error);
    }
}

function renderNewsGrid(news) {
    const container = document.getElementById('news-grid');
    
    if (!news || news.length === 0) {
        container.innerHTML = '<div class="no-data">Nenhuma notícia encontrada</div>';
        return;
    }
    
    const html = news.map(article => `
        <div class="news-item" onclick="openNewsLink('${article.articleUrl}')">
            <div class="news-content">
                <div class="news-title">${article.title}</div>
                <div class="news-summary">${article.summary || 'Resumo não disponível'}</div>
                <div class="news-meta">
                    <span class="news-source">${article.source || 'Fonte não informada'}</span>
                    <span>${formatDate(article.publishDate)}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function filterNews() {
    const category = document.getElementById('news-category-filter')?.value || '';
    const expert = document.getElementById('news-expert-filter')?.value || '';
    
    let filteredNews = newsData.filter(article => {
        const matchesCategory = !category || article.category === category;
        const matchesExpert = !expert || article.expertName === expert;
        
        return matchesCategory && matchesExpert;
    });
    
    renderNewsGrid(filteredNews);
}

// Glossary Functions
function setupGlossaryEventListeners() {
    const glossarySearch = document.getElementById('glossary-search');
    const categoryFilter = document.getElementById('glossary-category-filter');
    
    if (glossarySearch) {
        glossarySearch.addEventListener('input', debounce(filterGlossary, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGlossary);
    }
}

async function loadGlossaryData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/glossary`);
        const data = await response.json();
        
        if (data.success) {
            glossaryData = data.data;
            renderGlossaryGrid(glossaryData);
            await loadGlossaryFilters();
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading glossary data:', error);
        hideLoading();
    }
}

async function loadGlossaryFilters() {
    try {
        // Load categories
        const categoriesResponse = await fetch(`${API_BASE}/glossary/categories`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
            populateSelect('glossary-category-filter', categoriesData.data);
        }
        
        // Load alphabet filter
        const lettersResponse = await fetch(`${API_BASE}/glossary/letters`);
        const lettersData = await lettersResponse.json();
        
        if (lettersData.success) {
            renderAlphabetFilter(lettersData.data);
        }
    } catch (error) {
        console.error('Error loading glossary filters:', error);
    }
}

function renderAlphabetFilter(letters) {
    const container = document.getElementById('alphabet-filter');
    
    const html = letters.map(letter => `
        <button class="letter-btn" onclick="filterByLetter('${letter}')">${letter}</button>
    `).join('');
    
    container.innerHTML = html;
}

function renderGlossaryGrid(terms) {
    const container = document.getElementById('glossary-grid');
    
    if (!terms || terms.length === 0) {
        container.innerHTML = '<div class="no-data">Nenhum termo encontrado</div>';
        return;
    }
    
    const html = terms.map(term => `
        <div class="term-item" onclick="showTermDetails(${term.id})">
            <div class="term-name">${term.term}</div>
            <div class="term-definition">${truncateText(term.definition, 150)}</div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function filterGlossary() {
    const searchTerm = document.getElementById('glossary-search')?.value.toLowerCase() || '';
    const category = document.getElementById('glossary-category-filter')?.value || '';
    
    let filteredTerms = glossaryData.filter(term => {
        const matchesSearch = !searchTerm || 
            term.term.toLowerCase().includes(searchTerm) ||
            term.definition.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !category || term.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    renderGlossaryGrid(filteredTerms);
}

function filterByLetter(letter) {
    // Remove active class from all letter buttons
    document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    let filteredTerms = glossaryData.filter(term => 
        term.term.toUpperCase().startsWith(letter)
    );
    
    renderGlossaryGrid(filteredTerms);
}

// Suggestions Functions
function setupSuggestionsEventListeners() {
    const investmentTypeFilter = document.getElementById('investment-type-filter');
    const riskProfileFilter = document.getElementById('risk-profile-filter');
    
    [investmentTypeFilter, riskProfileFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterSuggestions);
        }
    });
}

async function loadSuggestionsData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/suggestions`);
        const data = await response.json();
        
        if (data.success) {
            suggestionsData = data.data;
            renderSuggestionsGrid(suggestionsData);
            await loadSuggestionsFilters();
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error loading suggestions data:', error);
        hideLoading();
    }
}

async function loadSuggestionsFilters() {
    try {
        // Load investment types
        const typesResponse = await fetch(`${API_BASE}/suggestions/types`);
        const typesData = await typesResponse.json();
        
        if (typesData.success) {
            populateSelect('investment-type-filter', typesData.data);
        }
        
        // Load risk profiles
        const profilesResponse = await fetch(`${API_BASE}/suggestions/risk-profiles`);
        const profilesData = await profilesResponse.json();
        
        if (profilesData.success) {
            populateSelect('risk-profile-filter', profilesData.data);
        }
    } catch (error) {
        console.error('Error loading suggestions filters:', error);
    }
}

function renderSuggestionsGrid(suggestions) {
    const container = document.getElementById('suggestions-grid');
    
    if (!suggestions || suggestions.length === 0) {
        container.innerHTML = '<div class="no-data">Nenhuma sugestão encontrada</div>';
        return;
    }
    
    const html = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <div class="suggestion-header">
                <div class="suggestion-symbol">${suggestion.symbol}</div>
                <div class="suggestion-tags">
                    <span class="tag investment-type">${suggestion.investmentType || 'N/A'}</span>
                    <span class="tag risk-profile">${suggestion.riskProfile || 'N/A'}</span>
                </div>
            </div>
            <div class="suggestion-justification">${suggestion.justification}</div>
            <div class="suggestion-footer">
                <span>Por: ${suggestion.analystName || 'Analista não informado'}</span>
                <span>${formatDate(suggestion.createdAt)}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function filterSuggestions() {
    const investmentType = document.getElementById('investment-type-filter')?.value || '';
    const riskProfile = document.getElementById('risk-profile-filter')?.value || '';
    
    let filteredSuggestions = suggestionsData.filter(suggestion => {
        const matchesType = !investmentType || suggestion.investmentType === investmentType;
        const matchesRisk = !riskProfile || suggestion.riskProfile === riskProfile;
        
        return matchesType && matchesRisk;
    });
    
    renderSuggestionsGrid(filteredSuggestions);
}

// Modal Functions
function setupModalEventListeners() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

function showStockDetails(symbol) {
    // For now, just show basic info
    // In a real implementation, you would fetch detailed stock data
    const modal = document.getElementById('stock-modal');
    const content = document.getElementById('stock-modal-content');
    
    content.innerHTML = `
        <h2>${symbol}</h2>
        <p>Detalhes da ação ${symbol} seriam exibidos aqui.</p>
        <p>Em uma implementação completa, isso incluiria:</p>
        <ul>
            <li>Gráfico de preços históricos</li>
            <li>Indicadores financeiros</li>
            <li>Notícias relacionadas</li>
            <li>Análises técnicas</li>
        </ul>
    `;
    
    modal.style.display = 'block';
}

function showTermDetails(termId) {
    const term = glossaryData.find(t => t.id === termId);
    if (!term) return;
    
    const modal = document.getElementById('term-modal');
    const content = document.getElementById('term-modal-content');
    
    content.innerHTML = `
        <h2>${term.term}</h2>
        <div class="term-category">${term.category || 'Categoria não informada'}</div>
        <div class="term-definition">${term.definition}</div>
        ${term.examples ? `<div class="term-examples"><strong>Exemplos:</strong> ${term.examples}</div>` : ''}
    `;
    
    modal.style.display = 'block';
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility Functions
function handleGlobalSearch() {
    const searchTerm = globalSearch.value.toLowerCase();
    
    if (!searchTerm) return;
    
    // Simple global search - in a real implementation, this would be more sophisticated
    switch (currentSection) {
        case 'stocks':
            document.getElementById('stock-search').value = searchTerm;
            filterStocks();
            break;
        case 'glossary':
            document.getElementById('glossary-search').value = searchTerm;
            filterGlossary();
            break;
    }
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Keep the first option (usually "All" or similar)
    const firstOption = select.children[0];
    select.innerHTML = '';
    select.appendChild(firstOption);
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

function openNewsLink(url) {
    if (url && url !== 'null' && url !== 'undefined') {
        window.open(url, '_blank');
    }
}

function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function formatDate(dateString) {
    if (!dateString) return 'Data não informada';
    
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    } catch (error) {
        return 'Data inválida';
    }
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    hideLoading();
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    hideLoading();
});


// Configuração da API
const API_BASE_URL = '/api';

// Estado da aplicação
let isAuthenticated = false;
let currentUser = null;
let currentMode = 'public'; // 'public' ou 'admin'

// Elementos DOM
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const adminAccessBtn = document.getElementById('adminAccessBtn');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const pageTitle = document.getElementById('pageTitle');
const userInfo = document.getElementById('userInfo');
const username = document.getElementById('username');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Verificar se está autenticado
    checkAuthentication();
    
    // Carregar dados do dashboard
    loadDashboardData();
    
    // Definir modo inicial como público
    setMode('public');
}

function setupEventListeners() {
    // Botão de acesso administrativo
    document.getElementById('adminAccessBtn').addEventListener('click', function() {
        showLoginForm();
    });
    
    // Voltar para área pública
    document.getElementById('backToPublic').addEventListener('click', function(e) {
        e.preventDefault();
        setMode('public');
    });
    
    // Form de login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        handleLogout();
    });
    
    // Navegação da sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Toggle da sidebar (mobile)
    document.getElementById('mobileMenuToggle').addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
}

async function checkAuthentication() {
    try {
        const response = await fetch(`${API_BASE_URL}/check-auth`);
        const data = await response.json();
        
        if (data.authenticated) {
            isAuthenticated = true;
            currentUser = { username: data.username };
            username.textContent = data.username;
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
}

async function handleLogin() {
    const loginUsername = document.getElementById('loginUsername').value;
    const loginPassword = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            isAuthenticated = true;
            currentUser = data.user;
            username.textContent = data.user.username;
            setMode('admin');
            showSection('dashboard');
        } else {
            alert(data.error || 'Erro no login');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro de conexão');
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, { method: 'POST' });
        isAuthenticated = false;
        currentUser = null;
        setMode('public');
    } catch (error) {
        console.error('Erro no logout:', error);
    }
}

function setMode(mode) {
    currentMode = mode;
    document.body.className = `${mode}-mode`;
    
    if (mode === 'public') {
        showSection('dashboard');
        pageTitle.textContent = 'Administração de Condomínios';
    } else if (mode === 'admin') {
        showSection('dashboard');
        pageTitle.textContent = 'Dashboard';
    }
}

function showLoginForm() {
    setMode('admin');
    showSection('login');
    pageTitle.textContent = 'Login';
}

function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção específica
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Atualizar navegação ativa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'condominiums': 'Condomínios',
        'residents': 'Moradores',
        'boletos': 'Boletos',
        'occurrences': 'Ocorrências',
        'announcements': 'Comunicados',
        'login': 'Login'
    };
    
    pageTitle.textContent = titles[sectionName] || 'Dashboard';
    
    // Carregar dados específicos da seção
    if (sectionName === 'dashboard') {
        loadDashboardData();
    }
}

async function loadDashboardData() {
    try {
        // Carregar estatísticas
        const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard`);
        const dashboardData = await dashboardResponse.json();
        
        document.getElementById('totalCondominiums').textContent = dashboardData.total_condominiums;
        document.getElementById('totalResidents').textContent = dashboardData.total_residents;
        document.getElementById('totalBoletos').textContent = dashboardData.total_boletos;
        document.getElementById('totalOccurrences').textContent = dashboardData.total_occurrences;
        
        // Carregar condomínios
        const condominiumsResponse = await fetch(`${API_BASE_URL}/condominiums`);
        const condominiums = await condominiumsResponse.json();
        displayCondominiums(condominiums);
        
        // Carregar boletos recentes
        const boletosResponse = await fetch(`${API_BASE_URL}/boletos/recent`);
        const boletos = await boletosResponse.json();
        displayRecentBoletos(boletos);
        
        // Carregar comunicados
        const announcementsResponse = await fetch(`${API_BASE_URL}/announcements`);
        const announcements = await announcementsResponse.json();
        displayAnnouncements(announcements);
        
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

function displayCondominiums(condominiums) {
    const container = document.getElementById('condominiumsList');
    
    if (condominiums.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Nenhum condomínio cadastrado</p>';
        return;
    }
    
    container.innerHTML = condominiums.map(condominium => `
        <div class="condominium-item">
            <div>
                <div class="condominium-name">${condominium.nome}</div>
                <div class="condominium-address">${condominium.endereco}</div>
            </div>
        </div>
    `).join('');
}

function displayRecentBoletos(boletos) {
    const tbody = document.getElementById('recentBoletosList');
    
    if (boletos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 2rem;">Nenhum boleto encontrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = boletos.map(boleto => `
        <tr>
            <td>${boleto.morador_nome || 'N/A'}</td>
            <td>R$ ${boleto.valor.toFixed(2).replace('.', ',')}</td>
            <td>${formatDate(boleto.data_vencimento)}</td>
            <td><span class="status-badge status-${boleto.status.toLowerCase()}">${boleto.status}</span></td>
        </tr>
    `).join('');
}

function displayAnnouncements(announcements) {
    const container = document.getElementById('announcementsList');
    const container2 = document.getElementById('announcementsList2');
    
    if (announcements.length === 0) {
        const emptyMessage = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">Nenhum comunicado encontrado</p>';
        container.innerHTML = emptyMessage;
        container2.innerHTML = emptyMessage;
        return;
    }
    
    const announcementHTML = announcements.map(announcement => `
        <div class="announcement-item">
            <div class="announcement-title">${announcement.titulo}</div>
            <div class="announcement-date">${formatDate(announcement.data_publicacao)}</div>
            <div class="announcement-content">${announcement.conteudo.substring(0, 100)}${announcement.conteudo.length > 100 ? '...' : ''}</div>
        </div>
    `).join('');
    
    container.innerHTML = announcementHTML;
    container2.innerHTML = announcementHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para popular dados de exemplo (para demonstração)
async function populateExampleData() {
    if (!isAuthenticated) {
        alert('Você precisa estar logado para popular dados de exemplo');
        return;
    }
    
    try {
        // Criar condomínio de exemplo
        await fetch(`${API_BASE_URL}/admin/condominiums`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: 'Residencial Alfa',
                endereco: 'Rua A, 123'
            })
        });
        
        // Criar comunicado de exemplo
        await fetch(`${API_BASE_URL}/admin/announcements`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                titulo: 'Assembleia Geral',
                conteudo: 'Fiore ship ingest etuo 15/04 Belarus žinr ijeesi dây ât de.'
            })
        });
        
        // Recarregar dados
        loadDashboardData();
        alert('Dados de exemplo criados com sucesso!');
        
    } catch (error) {
        console.error('Erro ao criar dados de exemplo:', error);
        alert('Erro ao criar dados de exemplo');
    }
}

// Expor função para console (para testes)
window.populateExampleData = populateExampleData;


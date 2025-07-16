// Navigation functionality
class Navigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'home';
        return page;
    }

    init() {
        this.createNavigationBar();
        this.createBottomNavigation();
        this.setActiveNavItem();
    }

    createNavigationBar() {
        const navBar = document.createElement('div');
        navBar.className = 'nav-bar';
        navBar.innerHTML = `
            <div class="nav-title">SmartWork</div>
            <div class="nav-menu">
                <button class="nav-btn" onclick="navigation.goToPage('home')">홈</button>
                <button class="nav-btn" onclick="navigation.logout()">로그아웃</button>
            </div>
        `;
        
        // Insert at the beginning of container
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(navBar, container.firstChild);
    }

    createBottomNavigation() {
        const bottomNav = document.createElement('div');
        bottomNav.className = 'bottom-nav';
        bottomNav.innerHTML = `
            <a href="home.html" class="nav-item" data-page="home">
                <div class="nav-icon">🏠</div>
                <span>홈</span>
            </a>
            <a href="todo.html" class="nav-item" data-page="todo">
                <div class="nav-icon">✅</div>
                <span>할일</span>
            </a>
            <a href="calendar.html" class="nav-item" data-page="calendar">
                <div class="nav-icon">📅</div>
                <span>일정</span>
            </a>
            <a href="util.html" class="nav-item" data-page="util">
                <div class="nav-icon">🔧</div>
                <span>도구</span>
            </a>
            <a href="mypage.html" class="nav-item" data-page="mypage">
                <div class="nav-icon">👤</div>
                <span>내정보</span>
            </a>
        `;
        
        document.body.appendChild(bottomNav);
    }

    setActiveNavItem() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.dataset.page === this.currentPage) {
                item.classList.add('active');
            }
        });
    }

    goToPage(page) {
        window.location.href = `${page}.html`;
    }

    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    }
}

// Utility functions
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.add('hidden'));
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Don't initialize navigation on login page
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    window.navigation = new Navigation();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
});

// Auth functions
function login(username, password) {
    // Mock login - replace with actual API call
    if (username && password) {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('username', username);
        window.location.href = 'home.html';
        return true;
    }
    return false;
}

function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

function getUsername() {
    return localStorage.getItem('username') || 'User';
}
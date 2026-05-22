// ====================================
// HOMIQ - main.js
// Shared functions for all pages
// ====================================

// Navbar HTML template
const navbarHTML = `
<nav class="navbar">
    <div class="navbar-container">
        <a href="/" class="navbar-logo" id="logoLink">
            HOM<span>IQ</span>
        </a>
        <div class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div class="navbar-menu" id="navbarMenu">
            <a href="/" class="navbar-link" data-page="home">Home</a>
            <a href="/pages/listings.html" class="navbar-link" data-page="listings">Listings</a>
            <a href="#" class="navbar-link" id="dashboardLink" style="display: none;">Dashboard</a>
            <div class="navbar-buttons" id="authButtons">
                <a href="/pages/login.html" class="btn btn-outline btn-sm">Login</a>
                <a href="/pages/register.html" class="btn btn-primary btn-sm">Register</a>
            </div>
            <div class="navbar-buttons" id="userInfo" style="display: none;">
                <span class="user-greeting" id="userGreeting"></span>
                <button class="btn btn-outline btn-sm" id="logoutBtn">Logout</button>
            </div>
        </div>
    </div>
</nav>
`;

// Footer HTML template
const footerHTML = `
<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-section">
                <h3 class="footer-title">HOM<span style="color: #F59E0B;">IQ</span></h3>
                <p>Your trusted partner in finding the perfect home in Bangladesh.</p>
            </div>
            <div class="footer-section">
                <h4 class="footer-title">Quick Links</h4>
                <ul class="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/pages/listings.html">Listings</a></li>
                    <li><a href="/pages/login.html">Login</a></li>
                    <li><a href="/pages/register.html">Register</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-title">For Landlords</h4>
                <ul class="footer-links">
                    <li><a href="/pages/landlord-dashboard.html">Post Property</a></li>
                    <li><a href="/pages/landlord-dashboard.html">Manage Listings</a></li>
                    <li><a href="#">Pricing</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4 class="footer-title">Contact</h4>
                <ul class="footer-links">
                    <li><a href="#">support@homiq.com</a></li>
                    <li><a href="#">+880 1234 567890</a></li>
                    <li><a href="#">Dhaka, Bangladesh</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 HOMIQ. All rights reserved.</p>
        </div>
    </div>
</footer>
`;

// Function to load navbar
function loadNavbar() {
    // Check if navbar already exists
    if (document.querySelector('.navbar')) return;
    
    // Insert navbar at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // Setup mobile hamburger
    setupHamburger();
    
    // Update navbar based on login state
    updateNavbarAuth();
    
    // Highlight active page
    highlightActivePage();
}

// Function to load footer
function loadFooter() {
    // Check if footer already exists
    if (document.querySelector('.footer')) return;
    
    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Setup mobile hamburger menu
function setupHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Update navbar based on login state
function updateNavbarAuth() {
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const userGreeting = document.getElementById('userGreeting');
    const dashboardLink = document.getElementById('dashboardLink');
    
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (currentUser && userRole) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userGreeting) {
            const user = JSON.parse(currentUser);
            userGreeting.textContent = `Hi, ${user.name || user.email.split('@')[0]}`;
        }
        
        // Show dashboard link with correct path based on role
        if (dashboardLink) {
            dashboardLink.style.display = 'inline-block';
            if (userRole === 'landlord') {
                dashboardLink.href = '/pages/landlord-dashboard.html';
                dashboardLink.textContent = 'Dashboard';
            } else if (userRole === 'admin') {
                dashboardLink.href = '/pages/admin-dashboard.html';
                dashboardLink.textContent = 'Admin';
            } else if (userRole === 'tenant') {
                dashboardLink.href = '/pages/tenant-dashboard.html';
                dashboardLink.textContent = 'Dashboard';
            } else {
                dashboardLink.href = '/pages/listings.html';
                dashboardLink.textContent = 'Browse';
            }
        }
        
        // Setup logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                window.location.href = '/';
            });
        }
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
    }
}

// Highlight active page in navbar
function highlightActivePage() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.navbar-link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            // Check if current page matches link
            if (currentPath === href) {
                link.classList.add('active');
            } else if (href === '/' && (currentPath === '/' || currentPath === '/index.html')) {
                link.classList.add('active');
            } else if (href !== '/' && currentPath.includes(href.replace('.html', ''))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// Function to check if user is logged in (for protected pages)
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Function to get user role
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Function to redirect if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/pages/login.html';
        return false;
    }
    return true;
}

// Function to redirect based on role
function requireRole(allowedRoles) {
    if (!requireAuth()) return false;
    
    const userRole = getUserRole();
    if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate page
        if (userRole === 'landlord') {
            window.location.href = '/pages/landlord-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = '/pages/admin-dashboard.html';
        } else if (userRole === 'tenant') {
            window.location.href = '/pages/tenant-dashboard.html';
        } else {
            window.location.href = '/pages/listings.html';
        }
        return false;
    }
    return true;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();
});
// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const body = document.body;

// Toggle mobile menu
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Prevent body scrolling when menu is open
    body.style.overflow = mobileMenu.classList.contains('hidden') ? 'auto' : 'hidden';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        body.style.overflow = 'auto';
    });
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Show/Hide Login Modal
function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideLoginModal();
    }
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (replace with proper authentication in production)
    if (username === 'admin1' && password === 'admin12345') {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redirect to admin dashboard
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials');
    }
});

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Load menu items
function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const menuContainer = document.getElementById('menuItems');
    
    if (!menuContainer) return; // Only proceed if we're on the menu page

    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item bg-white rounded-lg shadow-lg overflow-hidden';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-playfair font-bold mb-2">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-2">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-accent font-bold">₱${item.price}</span>
                    <span class="text-sm text-gray-500">${item.category}</span>
                </div>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Filter menu items
function filterMenu(category) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const menuContainer = document.getElementById('menuItems');
    
    if (!menuContainer) return; // Only proceed if we're on the menu page

    menuContainer.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item bg-white rounded-lg shadow-lg overflow-hidden';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-playfair font-bold mb-2">${item.name}</h3>
                <p class="text-gray-600 text-sm mb-2">${item.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-accent font-bold">₱${item.price}</span>
                    <span class="text-sm text-gray-500">${item.category}</span>
                </div>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
}); 
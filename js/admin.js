// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializeSampleData();
    loadMenuItems();
    displayAdminName();
    setupImagePreview();
    setupSearch();
});

// Initialize sample data
function initializeSampleData() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems'));
    if (!menuItems || menuItems.length === 0) {
        const sampleItems = [
            {
                id: '1',
                name: 'Classic Caesar Salad',
                description: 'Fresh romaine lettuce, croutons, parmesan cheese with our signature Caesar dressing',
                category: 'appetizers',
                price: '299.00',
                image: 'src/assets/images/code-8779051_1280.jpg'
            },
            {
                id: '2',
                name: 'Grilled Salmon',
                description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter sauce',
                category: 'main-course',
                price: '599.00',
                image: 'assets/images/grilled-salmon.jpg'
            },
            {
                id: '3',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
                category: 'desserts',
                price: '199.00',
                image: 'assets/images/lava-cake.jpg'
            },
            {
                id: '4',
                name: 'Fresh Fruit Smoothie',
                description: 'Blend of seasonal fruits with yogurt and honey',
                category: 'beverages',
                price: '149.00',
                image: 'assets/images/smoothie.jpg'
            }
        ];
        localStorage.setItem('menuItems', JSON.stringify(sampleItems));
    }
}

// Display admin name
function displayAdminName() {
    const username = localStorage.getItem('username');
    document.getElementById('adminName').textContent = `Welcome, ${username}`;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Image preview setup
function setupImagePreview() {
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = imagePreview.querySelector('img');

    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });
}

// Modal functions
function showAddItemModal() {
    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('itemModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function showEditItemModal(item) {
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    
    // Show existing image preview
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = imagePreview.querySelector('img');
    previewImg.src = item.image;
    imagePreview.classList.remove('hidden');
    
    document.getElementById('itemModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.getElementById('itemModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideItemModal();
    }
});

// Handle form submission
document.getElementById('itemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const imageFile = document.getElementById('itemImage').files[0];
    let imagePath = '';

    // Handle image upload
    if (imageFile) {
        try {
            imagePath = await saveImage(imageFile, itemId);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
            return;
        }
    }

    const item = {
        id: itemId || Date.now().toString(),
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        category: document.getElementById('itemCategory').value,
        price: document.getElementById('itemPrice').value,
        image: imagePath || document.getElementById('imagePreview').querySelector('img').src
    };

    saveMenuItem(item);
    hideItemModal();
    loadMenuItems();
});

// Save image to assets folder
async function saveImage(file, itemId) {
    // In a real application, you would upload this to a server
    // For this demo, we'll use the FileReader to create a data URL
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            // In a real application, you would:
            // 1. Upload the file to a server
            // 2. Get back a URL or path to the saved file
            // 3. Store that URL/path in your database
            // For this demo, we'll use the data URL
            resolve(e.target.result);
        };
        reader.onerror = function(e) {
            reject(new Error('Error reading file'));
        };
        reader.readAsDataURL(file);
    });
}

// Save menu item
function saveMenuItem(item) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    const index = menuItems.findIndex(i => i.id === item.id);
    
    if (index === -1) {
        menuItems.push(item);
    } else {
        menuItems[index] = item;
    }
    
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
        
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
        
        displayMenuItems(filteredItems);
    });
}

// Display menu items in table
function displayMenuItems(items) {
    const tableBody = document.getElementById('menuItemsTable');
    tableBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${item.image}" alt="${item.name}" class="h-12 w-12 rounded-lg object-cover">
            </td>
            <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-500">${item.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent/10 text-accent">
                    ${item.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ₱${Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick='showEditItemModal(${JSON.stringify(item)})' class="text-accent hover:text-accent/80 mr-3">
                    Edit
                </button>
                <button onclick="deleteMenuItem('${item.id}')" class="text-danger hover:text-danger/80">
                    Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load menu items
function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    displayMenuItems(menuItems);
}

// Delete menu item
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
        const filteredItems = menuItems.filter(item => item.id !== id);
        localStorage.setItem('menuItems', JSON.stringify(filteredItems));
        loadMenuItems();
    }
} 

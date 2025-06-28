// Get DOM elements
const productForm = document.getElementById('productForm');
const inventoryTable = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

// Initialize products array from localStorage or empty array
let products = JSON.parse(localStorage.getItem('products')) || [];

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Add new product
function addProduct(name, barcode, expiryDate) {
    const product = {
        id: Date.now(),
        name,
        barcode,
        expiryDate,
        status: getStatus(expiryDate)
    };
    products.push(product);
    saveProducts();
    addProductToTable(product);
    showMessage('Product added successfully!', 'success');
}

// Get status based on expiry date
function getStatus(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diff <= 0) return 'expired';
    if (diff <= 3) return 'near-expiry';
    return 'fresh';
}

// Add product to table
function addProductToTable(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.barcode}</td>
        <td>${product.expiryDate}</td>
        <td><span class="status-${product.status}">${product.status}</span></td>
        <td>
            <button onclick="deleteProduct(${product.id})" class="delete-btn">Delete</button>
            <button onclick="editProduct(${product.id})" class="edit-btn">Edit</button>
        </td>
    `;
    inventoryTable.appendChild(row);
}

// Delete product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        refreshTable();
        showMessage('Product deleted successfully!', 'success');
    }
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        const newName = prompt('Enter new product name:', product.name);
        const newBarcode = prompt('Enter new barcode:', product.barcode);
        const newExpiry = prompt('Enter new expiry date (YYYY-MM-DD):', product.expiryDate);
        
        if (newName && newBarcode && newExpiry) {
            product.name = newName;
            product.barcode = newBarcode;
            product.expiryDate = newExpiry;
            product.status = getStatus(newExpiry);
            saveProducts();
            refreshTable();
            showMessage('Product updated successfully!', 'success');
        }
    }
}

// Refresh table
function refreshTable() {
    inventoryTable.innerHTML = '';
    const filteredProducts = filterProducts();
    filteredProducts.forEach(addProductToTable);
}

// Filter products
function filterProducts() {
    let filtered = [...products];
    
    const category = categoryFilter.value;
    const status = statusFilter.value;
    
    if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
    }
    
    if (status !== 'all') {
        filtered = filtered.filter(product => product.status === status);
    }
    
    return filtered;
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Event Listeners
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const barcode = document.getElementById('barcode').value;
    const expiryDate = document.getElementById('expiryDate').value;
    
    addProduct(name, barcode, expiryDate);
    productForm.reset();
});

categoryFilter.addEventListener('change', refreshTable);
statusFilter.addEventListener('change', refreshTable);

// Load existing products on page load
window.addEventListener('load', () => {
    refreshTable();
}); 
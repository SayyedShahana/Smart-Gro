// Get DOM elements
const donationList = document.getElementById('donationList');
const donationCategory = document.getElementById('donationCategory');
const donationStatus = document.getElementById('donationStatus');

// Initialize donations array from localStorage or empty array
let donations = JSON.parse(localStorage.getItem('donations')) || [];

// Save donations to localStorage
function saveDonations() {
    localStorage.setItem('donations', JSON.stringify(donations));
}

// Get days until expiry
function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

// Add item to donation list
function addToDonationList(product) {
    const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate);
    if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        const donationItem = {
            id: product.id,
            name: product.name,
            expiryDate: product.expiryDate,
            daysUntilExpiry: daysUntilExpiry,
            status: daysUntilExpiry === 1 ? 'urgent' : 'soon'
        };
        donations.push(donationItem);
        saveDonations();
        addDonationItemToList(donationItem);
    }
}

// Add donation item to list
function addDonationItemToList(item) {
    const li = document.createElement('li');
    li.className = 'donation-item';
    li.innerHTML = `
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>Expires in: ${item.daysUntilExpiry} day${item.daysUntilExpiry !== 1 ? 's' : ''}</p>
            <p>Status: ${item.status}</p>
        </div>
        <button onclick="donateItem(${item.id})" class="donate-btn">Donate Now</button>
    `;
    donationList.appendChild(li);
}

// Donate item
function donateItem(id) {
    if (confirm('Are you sure you want to donate this item?')) {
        donations = donations.filter(item => item.id !== id);
        saveDonations();
        refreshDonationList();
        updateDonationStats();
        showMessage('Item donated successfully!', 'success');
    }
}

// Refresh donation list
function refreshDonationList() {
    donationList.innerHTML = '';
    const filteredDonations = filterDonations();
    filteredDonations.forEach(addDonationItemToList);
}

// Filter donations
function filterDonations() {
    let filtered = [...donations];
    
    const category = donationCategory.value;
    const status = donationStatus.value;
    
    if (category !== 'all') {
        filtered = filtered.filter(item => item.category === category);
    }
    
    if (status !== 'all') {
        filtered = filtered.filter(item => item.status === status);
    }
    
    return filtered;
}

// Update donation statistics
function updateDonationStats() {
    const totalDonations = donations.length;
    const impact = totalDonations * 2; // Assuming each donation helps 2 people
    const wasteReduced = totalDonations * 0.5; // Assuming each donation prevents 0.5kg of waste
    
    document.querySelector('.stat-number:nth-child(1)').textContent = totalDonations;
    document.querySelector('.stat-number:nth-child(2)').textContent = impact;
    document.querySelector('.stat-number:nth-child(3)').textContent = `${wasteReduced} kg`;
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
donationCategory.addEventListener('change', refreshDonationList);
donationStatus.addEventListener('change', refreshDonationList);

// Load donations from inventory on page load
window.addEventListener('load', () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(addToDonationList);
    updateDonationStats();
}); 
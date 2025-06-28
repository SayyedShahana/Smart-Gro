// Update stats from localStorage
function updateStats() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Update total items
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = products.length;
    
    // Update waste reduced (assuming 65% reduction)
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = '65%';
    
    // Update items donated
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = donations.length;
}

// Initialize the page
window.addEventListener('load', () => {
    updateStats();
}); 
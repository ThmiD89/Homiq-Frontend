// ====================================
// HOMIQ - Tenant Dashboard JavaScript
// ====================================

let currentUser = null;
let allProperties = [];
let paymentHistory = [];
let userBookings = [];
let cancelBookingId = null;

// ====================================
// INITIALIZATION
// ====================================

function initTenantDashboard() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!storedUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userRole !== 'tenant') {
        if (userRole === 'landlord') {
            window.location.href = 'landlord-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
        return;
    }
    
    currentUser = JSON.parse(storedUser);
    loadData();
    displayDateTime();
    updateStats();
    displayActiveBookings();
    displayPastBookings();
    displayProfile();
}

function loadData() {
    allProperties = JSON.parse(localStorage.getItem('allProperties')) || [];
    paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
    
    // Get user's bookings from payment history
    userBookings = paymentHistory.filter(p => p.tenantEmail === currentUser.email);
    
    // Also check properties that are booked by this tenant
    const bookedProperties = allProperties.filter(p => 
        p.status === 'booked' && p.bookedBy === currentUser.email
    );
    
    // Merge bookings
    bookedProperties.forEach(prop => {
        if (!userBookings.find(b => b.propertyId === prop.id)) {
            userBookings.push({
                propertyId: prop.id,
                propertyTitle: prop.title,
                propertyLocation: prop.location,
                propertyImage: prop.image,
                amount: prop.rent,
                date: prop.bookedDate || new Date().toISOString(),
                status: 'active'
            });
        }
    });
}

function displayDateTime() {
    const dateElement = document.getElementById('currentDateTime');
    if (dateElement) {
        dateElement.innerHTML = new Date().toLocaleString();
    }
    setTimeout(displayDateTime, 1000);
}

function updateStats() {
    const activeBookings = userBookings.filter(b => b.status === 'active').length;
    const totalSpent = userBookings.reduce((sum, b) => sum + (parseInt(b.amount) || 0), 0);
    
    document.getElementById('totalBookings').textContent = userBookings.length;
    document.getElementById('activeBookings').textContent = activeBookings;
    document.getElementById('totalSpent').textContent = `৳${totalSpent.toLocaleString()}`;
    
    const memberDate = new Date(currentUser.createdAt);
    document.getElementById('memberSince').textContent = memberDate.getFullYear();
}

// ====================================
// DISPLAY ACTIVE BOOKINGS
// ====================================

function displayActiveBookings() {
    const container = document.getElementById('activeBookingsList');
    const activeBookings = userBookings.filter(b => b.status === 'active');
    
    if (!container) return;
    
    if (activeBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">🏠</div>
                <h3 class="empty-title">No Active Bookings</h3>
                <p class="empty-text">You haven't booked any properties yet.</p>
                <a href="listings.html" class="btn btn-primary">Browse Properties</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeBookings.map(booking => `
        <div class="booking-card">
            <div class="booking-card-image">
                <img src="${booking.propertyImage || 'https://placehold.co/400x300/e5e7eb/1f2937?text=Property'}" alt="${booking.propertyTitle}">
                <span class="badge badge-available">Active</span>
            </div>
            <div class="booking-card-content">
                <h3 class="booking-title">${booking.propertyTitle}</h3>
                <div class="booking-location">📍 ${booking.propertyLocation || 'Location not specified'}</div>
                <div class="booking-details">
                    <span>💰 Paid: ৳${parseInt(booking.amount).toLocaleString()}</span>
                    <span>📅 Booked: ${new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewProperty(${booking.propertyId})">View Property</button>
                    <button class="btn btn-danger btn-sm" onclick="showCancelModal(${booking.propertyId})">Cancel Booking</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ====================================
// DISPLAY PAST BOOKINGS
// ====================================

function displayPastBookings() {
    const container = document.getElementById('pastBookingsList');
    const pastBookings = userBookings.filter(b => b.status === 'cancelled' || b.status === 'completed');
    
    if (!container) return;
    
    if (pastBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">📜</div>
                <h3 class="empty-title">No Booking History</h3>
                <p class="empty-text">Your past bookings will appear here.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = pastBookings.map(booking => `
        <div class="booking-card past">
            <div class="booking-card-image">
                <img src="${booking.propertyImage || 'https://placehold.co/400x300/e5e7eb/1f2937?text=Property'}" alt="${booking.propertyTitle}">
                <span class="badge badge-gray">${booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}</span>
            </div>
            <div class="booking-card-content">
                <h3 class="booking-title">${booking.propertyTitle}</h3>
                <div class="booking-location">📍 ${booking.propertyLocation || 'Location not specified'}</div>
                <div class="booking-details">
                    <span>💰 Paid: ৳${parseInt(booking.amount).toLocaleString()}</span>
                    <span>📅 Booked: ${new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <button class="btn btn-outline btn-sm" onclick="viewProperty(${booking.propertyId})">View Property</button>
            </div>
        </div>
    `).join('');
}

// ====================================
// PROFILE DISPLAY
// ====================================

function displayProfile() {
    const detailedUsers = JSON.parse(localStorage.getItem('detailedUsers')) || {};
    const userDetails = detailedUsers[currentUser.id] || {};
    
    document.getElementById('profileName').textContent = currentUser.name || 'User';
    document.getElementById('profileUserId').textContent = `User ID: ${currentUser.userId || 'N/A'}`;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone || 'Not provided';
    document.getElementById('profileJoined').textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Not available';
    document.getElementById('profileOccupation').textContent = userDetails.occupation || 'Not specified';
    document.getElementById('profilePreferredArea').textContent = userDetails.preferredArea || 'Not specified';
    
    // Also show current address if available
    const currentAddressElement = document.getElementById('profileCurrentAddress');
    if (currentAddressElement) {
        currentAddressElement.textContent = userDetails.currentAddress || 'Not specified';
    }
    
    // Show company name if available
    const companyElement = document.getElementById('profileCompany');
    if (companyElement) {
        companyElement.textContent = userDetails.companyName || 'Not specified';
    }
    
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
        greeting.textContent = `Welcome back, ${currentUser.name || 'Tenant'}!`;
    }
}

// ====================================
// BOOKING ACTIONS
// ====================================

function viewProperty(propertyId) {
    window.location.href = `property-detail.html?id=${propertyId}`;
}

function showCancelModal(propertyId) {
    cancelBookingId = propertyId;
    const modal = document.getElementById('cancelModal');
    if (modal) modal.classList.add('active');
    
    const confirmBtn = document.getElementById('confirmCancelBtn');
    if (confirmBtn) {
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        newBtn.addEventListener('click', cancelBooking);
    }
}

function cancelBooking() {
    if (!cancelBookingId) return;
    
    // Update property status
    const propertyIndex = allProperties.findIndex(p => p.id === cancelBookingId);
    if (propertyIndex !== -1) {
        allProperties[propertyIndex].status = 'available';
        allProperties[propertyIndex].bookedBy = null;
        allProperties[propertyIndex].bookedDate = null;
        localStorage.setItem('allProperties', JSON.stringify(allProperties));
    }
    
    // Update booking status in payment history
    const paymentIndex = paymentHistory.findIndex(p => p.propertyId === cancelBookingId);
    if (paymentIndex !== -1) {
        paymentHistory[paymentIndex].status = 'cancelled';
        localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
    }
    
    // Reload data
    loadData();
    updateStats();
    displayActiveBookings();
    displayPastBookings();
    
    closeCancelModal();
    showMessage('Booking cancelled successfully!', 'success');
}

function closeCancelModal() {
    const modal = document.getElementById('cancelModal');
    if (modal) modal.classList.remove('active');
    cancelBookingId = null;
}

// ====================================
// TAB SWITCHING
// ====================================

function switchTenantTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('onclick')?.includes(tabId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabId}Tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Make functions global
window.switchTenantTab = switchTenantTab;
window.viewProperty = viewProperty;
window.showCancelModal = showCancelModal;
window.closeCancelModal = closeCancelModal;
window.logout = logout;

// Initialize
document.addEventListener('DOMContentLoaded', initTenantDashboard);
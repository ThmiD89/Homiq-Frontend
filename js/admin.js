// ====================================
// HOMIQ - Admin Dashboard JavaScript (Simplified)
// ====================================

let allUsers = [];
let allProperties = [];
let paymentHistory = [];
let currentUserPage = 1;
let currentPropertyPage = 1;
let itemsPerPage = 10;
let currentConfirmAction = null;

// ====================================
// INITIALIZATION
// ====================================

function initAdminDashboard() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userRole !== 'admin') {
        if (userRole === 'landlord') window.location.href = 'landlord-dashboard.html';
        else if (userRole === 'tenant') window.location.href = 'listings.html';
        else window.location.href = 'login.html';
        return;
    }
    
    loadData();
    displayDateTime();
    setupEventListeners();
}

function loadData() {
    allUsers = JSON.parse(localStorage.getItem('users')) || [];
    allProperties = JSON.parse(localStorage.getItem('allProperties')) || [];
    paymentHistory = JSON.parse(localStorage.getItem('paymentHistory')) || [];
    
    displayUsers();
    displayProperties();
    displayPayments();
    updateStats();
}

function displayDateTime() {
    const dateElement = document.getElementById('currentDateTime');
    if (dateElement) {
        dateElement.innerHTML = new Date().toLocaleString();
    }
    setTimeout(displayDateTime, 1000);
}

function updateStats() {
    document.getElementById('totalUsers').textContent = allUsers.length;
    document.getElementById('totalProperties').textContent = allProperties.length;
    document.getElementById('activeProperties').textContent = allProperties.filter(p => p.status === 'available').length;
    document.getElementById('bookedProperties').textContent = allProperties.filter(p => p.status === 'booked').length;
}

// ====================================
// USER MANAGEMENT
// ====================================

function displayUsers() {
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('userRoleFilter')?.value || 'all';
    
    let filtered = allUsers.filter(u => 
        (u.name || '').toLowerCase().includes(searchTerm) || 
        (u.email || '').toLowerCase().includes(searchTerm) ||
        (u.userId || '').toLowerCase().includes(searchTerm)
    );
    
    if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);
    
    const start = (currentUserPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
        return;
    }
    
    tbody.innerHTML = paginated.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.userId || 'N/A'}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-active">${user.role}</span></td>
            <td><span class="status-badge status-active">Active</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>
                <button class="action-btn action-btn-view" onclick="viewUserDetails(${user.id})">View</button>
                ${user.role !== 'admin' ? `<button class="action-btn action-btn-delete" onclick="deleteUser(${user.id})">Delete</button>` : ''}
            </td>
        </tr>
    `).join('');
    
    updateUsersPagination(filtered.length);
}

function updateUsersPagination(total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pagination = document.getElementById('usersPagination');
    if (!pagination) return;
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentUserPage ? 'active' : ''}" onclick="goToUserPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

function goToUserPage(page) { currentUserPage = page; displayUsers(); }

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');
    
    content.innerHTML = `
        <p><strong>User ID:</strong> ${user.userId || 'N/A'}</p>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
    `;
    modal.classList.add('active');
}

function closeUserDetailModal() { document.getElementById('userDetailModal')?.classList.remove('active'); }

function deleteUser(userId) {
    showConfirmModal('Delete User', 'Are you sure you want to delete this user?', () => {
        allUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(allUsers));
        loadData();
        showMessage('User deleted successfully!', 'success');
    });
}

// ====================================
// PROPERTY MANAGEMENT
// ====================================

function displayProperties() {
    const searchTerm = document.getElementById('propertySearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('propertyStatusFilter')?.value || 'all';
    
    let filtered = allProperties.filter(p => 
        (p.title || '').toLowerCase().includes(searchTerm) || 
        (p.location || '').toLowerCase().includes(searchTerm)
    );
    
    if (statusFilter !== 'all') filtered = filtered.filter(p => p.status === statusFilter);
    
    const start = (currentPropertyPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    
    const tbody = document.getElementById('propertiesTableBody');
    if (!tbody) return;
    
    if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No properties found</td></tr>';
        return;
    }
    
    tbody.innerHTML = paginated.map(property => `
        <tr>
            <td><img src="${property.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
            <td><strong>${property.title}</strong></td>
            <td>${property.location}</td>
            <td>${property.landlordName || 'Unknown'}</td>
            <td>৳${property.rent.toLocaleString()}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${property.status === 'available' ? 'checked' : ''} onchange="togglePropertyStatus(${property.id}, this.checked)">
                    <span class="slider"></span>
                </label>
                <span style="margin-left: 8px;">${property.status === 'available' ? 'Available' : 'Booked'}</span>
            </td>
            <td><button class="action-btn action-btn-delete" onclick="deleteProperty(${property.id})">Delete</button></td>
        </tr>
    `).join('');
    
    updatePropertiesPagination(filtered.length);
}

function updatePropertiesPagination(total) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pagination = document.getElementById('propertiesPagination');
    if (!pagination) return;
    if (totalPages <= 1) { pagination.innerHTML = ''; return; }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPropertyPage ? 'active' : ''}" onclick="goToPropertyPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

function goToPropertyPage(page) { currentPropertyPage = page; displayProperties(); }

function togglePropertyStatus(propertyId, isAvailable) {
    const index = allProperties.findIndex(p => p.id === propertyId);
    if (index !== -1) {
        allProperties[index].status = isAvailable ? 'available' : 'booked';
        localStorage.setItem('allProperties', JSON.stringify(allProperties));
        loadData();
        showMessage(`Property status updated to ${isAvailable ? 'Available' : 'Booked'}`, 'success');
    }
}

function deleteProperty(propertyId) {
    showConfirmModal('Delete Property', 'Are you sure you want to delete this property?', () => {
        allProperties = allProperties.filter(p => p.id !== propertyId);
        localStorage.setItem('allProperties', JSON.stringify(allProperties));
        loadData();
        showMessage('Property deleted successfully!', 'success');
    });
}

// ====================================
// PAYMENT MANAGEMENT
// ====================================

function displayPayments() {
    const searchTerm = document.getElementById('paymentSearch')?.value.toLowerCase() || '';
    
    let filtered = paymentHistory.filter(p => 
        (p.propertyTitle || '').toLowerCase().includes(searchTerm) ||
        (p.transactionId || '').toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('paymentsTableBody');
    if (!tbody) return;
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No payment records found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filtered.map(payment => `
        <tr>
            <td>${payment.transactionId || 'N/A'}</td>
            <td>${payment.propertyTitle || 'N/A'}</td>
            <td>৳${parseInt(payment.amount).toLocaleString()}</td>
            <td>${payment.method || 'N/A'}</td>
            <td>${new Date(payment.date).toLocaleString()}</td>
            <td><span class="status-badge status-active">Completed</span></td>
        </tr>
    `).join('');
}

// ====================================
// REPORT FUNCTIONS
// ====================================

function generateUserReport() {
    const users = allUsers.map(u => ({ Name: u.name, Email: u.email, Role: u.role }));
    downloadCSV(users, 'user_report.csv');
}

function generatePropertyReport() {
    const properties = allProperties.map(p => ({ Title: p.title, Location: p.location, Rent: p.rent, Status: p.status }));
    downloadCSV(properties, 'property_report.csv');
}

function generatePaymentReport() {
    downloadCSV(paymentHistory, 'payment_report.csv');
}

function generateFullReport() {
    const report = { users: allUsers, properties: allProperties, payments: paymentHistory, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `full_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showMessage('Full report downloaded!', 'success');
}

function downloadCSV(data, filename) {
    if (!data.length) { showMessage('No data to export', 'error'); return; }
    const headers = Object.keys(data[0]);
    const rows = [headers.join(',')];
    for (const row of data) {
        rows.push(headers.map(h => `"${(row[h] || '').toString().replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showMessage('Report downloaded!', 'success');
}

// ====================================
// SYSTEM STATS
// ====================================

function showSystemStats() {
    const modal = document.getElementById('systemStatsModal');
    const content = document.getElementById('systemStatsContent');
    const totalRevenue = paymentHistory.reduce((sum, p) => sum + parseInt(p.amount || 0), 0);
    
    content.innerHTML = `
        <p><strong>Total Users:</strong> ${allUsers.length}</p>
        <p><strong>Landlords:</strong> ${allUsers.filter(u => u.role === 'landlord').length}</p>
        <p><strong>Tenants:</strong> ${allUsers.filter(u => u.role === 'tenant').length}</p>
        <p><strong>Total Properties:</strong> ${allProperties.length}</p>
        <p><strong>Available:</strong> ${allProperties.filter(p => p.status === 'available').length}</p>
        <p><strong>Booked:</strong> ${allProperties.filter(p => p.status === 'booked').length}</p>
        <p><strong>Total Revenue:</strong> ৳${totalRevenue.toLocaleString()}</p>
        <p><strong>Total Transactions:</strong> ${paymentHistory.length}</p>
    `;
    modal.classList.add('active');
}

function closeSystemStatsModal() { document.getElementById('systemStatsModal')?.classList.remove('active'); }

// ====================================
// UTILITY FUNCTIONS
// ====================================

function setupEventListeners() {
    document.getElementById('userSearch')?.addEventListener('input', () => { currentUserPage = 1; displayUsers(); });
    document.getElementById('userRoleFilter')?.addEventListener('change', () => { currentUserPage = 1; displayUsers(); });
    document.getElementById('propertySearch')?.addEventListener('input', () => { currentPropertyPage = 1; displayProperties(); });
    document.getElementById('propertyStatusFilter')?.addEventListener('change', () => { currentPropertyPage = 1; displayProperties(); });
    document.getElementById('paymentSearch')?.addEventListener('input', displayPayments);
}

function refreshData() { loadData(); showMessage('Data refreshed!', 'success'); }

function clearAllFilters() {
    document.getElementById('userSearch').value = '';
    document.getElementById('userRoleFilter').value = 'all';
    document.getElementById('propertySearch').value = '';
    document.getElementById('propertyStatusFilter').value = 'all';
    document.getElementById('paymentSearch').value = '';
    currentUserPage = 1; currentPropertyPage = 1;
    displayUsers(); displayProperties(); displayPayments();
    showMessage('All filters cleared!', 'success');
}

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    currentConfirmAction = onConfirm;
    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.addEventListener('click', () => { currentConfirmAction(); closeConfirmModal(); });
    modal.classList.add('active');
}

function closeConfirmModal() { document.getElementById('confirmModal')?.classList.remove('active'); }

function showMessage(msg, type) {
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function exportAllData() {
    const data = { users: allUsers, properties: allProperties, payments: paymentHistory };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `homiq_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showMessage('All data exported!', 'success');
}

// Make functions global
window.viewUserDetails = viewUserDetails;
window.closeUserDetailModal = closeUserDetailModal;
window.deleteUser = deleteUser;
window.goToUserPage = goToUserPage;
window.goToPropertyPage = goToPropertyPage;
window.togglePropertyStatus = togglePropertyStatus;
window.deleteProperty = deleteProperty;
window.generateUserReport = generateUserReport;
window.generatePropertyReport = generatePropertyReport;
window.generatePaymentReport = generatePaymentReport;
window.generateFullReport = generateFullReport;
window.showSystemStats = showSystemStats;
window.closeSystemStatsModal = closeSystemStatsModal;
window.refreshData = refreshData;
window.clearAllFilters = clearAllFilters;
window.exportAllData = exportAllData;
window.closeConfirmModal = closeConfirmModal;

document.addEventListener('DOMContentLoaded', initAdminDashboard);
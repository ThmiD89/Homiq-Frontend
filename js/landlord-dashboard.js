// ====================================
// HOMIQ - Landlord Dashboard JavaScript
// ====================================

let currentLandlord = null;
let allProperties = [];
let editingPropertyId = null;
let deletePropertyId = null;

function initLandlordDashboard() {
    const currentUser = localStorage.getItem('currentUser');
    const userRole = localStorage.getItem('userRole');
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    if (userRole !== 'landlord') {
        if (userRole === 'tenant') {
            window.location.href = 'tenant-dashboard.html';
        } else if (userRole === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'login.html';
        }
        return;
    }
    
    currentLandlord = JSON.parse(currentUser);
    
    document.getElementById('landlordName').textContent = `Welcome, ${currentLandlord.name || 'Landlord'}!`;
    document.getElementById('currentDateTime').innerHTML = new Date().toLocaleString();
    
    loadProperties();
    displayProperties();
}

function loadProperties() {
    allProperties = JSON.parse(localStorage.getItem('allProperties')) || [];
    // Filter properties by landlord email
    allProperties = allProperties.filter(p => p.landlordEmail === currentLandlord.email);
}

function displayProperties() {
    const container = document.getElementById('propertiesList');
    
    if (!container) return;
    
    const totalProps = allProperties.length;
    const available = allProperties.filter(p => p.status === 'available').length;
    const booked = allProperties.filter(p => p.status === 'booked').length;
    const earnings = allProperties.reduce((sum, p) => sum + (p.status === 'booked' ? p.rent : 0), 0);
    
    document.getElementById('totalProperties').textContent = totalProps;
    document.getElementById('availableProperties').textContent = available;
    document.getElementById('bookedProperties').textContent = booked;
    document.getElementById('totalEarnings').textContent = `৳${earnings.toLocaleString()}`;
    
    if (allProperties.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-icon">🏠</div>
                <h3 class="empty-title">No Properties Yet</h3>
                <p class="empty-text">Click "Add New Property" to list your first property.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = allProperties.map(property => `
        <div class="booking-card">
            <div class="booking-card-image">
                <img src="${property.image}" alt="${property.title}">
                <span class="badge ${property.status === 'available' ? 'badge-available' : 'badge-booked'}">${property.status === 'available' ? 'Available' : 'Booked'}</span>
            </div>
            <div class="booking-card-content">
                <h3 class="booking-title">${property.title}</h3>
                <div class="booking-location">📍 ${property.location}</div>
                <div class="booking-details">
                    <span>💰 ৳${property.rent.toLocaleString()}/month</span>
                    <span>🛏️ ${property.bedrooms} beds</span>
                    <span>🚿 ${property.bathrooms} baths</span>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-outline btn-sm" onclick="editProperty(${property.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${property.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddPropertyForm() {
    editingPropertyId = null;
    document.getElementById('formTitle').textContent = 'Add New Property';
    document.getElementById('propertyForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('addPropertyFormContainer').style.display = 'block';
    document.getElementById('addPropertyFormContainer').scrollIntoView({ behavior: 'smooth' });
}

function hideAddPropertyForm() {
    document.getElementById('addPropertyFormContainer').style.display = 'none';
}

function editProperty(id) {
    const property = allProperties.find(p => p.id === id);
    if (!property) return;
    
    editingPropertyId = id;
    document.getElementById('formTitle').textContent = 'Edit Property';
    document.getElementById('propertyTitle').value = property.title;
    document.getElementById('propertyLocation').value = property.location;
    document.getElementById('rentAmount').value = property.rent;
    document.getElementById('bedrooms').value = property.bedrooms;
    document.getElementById('bathrooms').value = property.bathrooms;
    document.getElementById('area').value = property.area;
    document.getElementById('floor').value = property.floor || '';
    document.getElementById('description').value = property.description;
    document.getElementById('imageUrl').value = property.image;
    
    const statusRadio = document.querySelector(`input[name="status"][value="${property.status}"]`);
    if (statusRadio) statusRadio.checked = true;
    
    document.getElementById('addPropertyFormContainer').style.display = 'block';
    document.getElementById('addPropertyFormContainer').scrollIntoView({ behavior: 'smooth' });
}

function saveProperty(e) {
    e.preventDefault();
    
    const propertyData = {
        title: document.getElementById('propertyTitle').value.trim(),
        location: document.getElementById('propertyLocation').value.trim(),
        rent: parseInt(document.getElementById('rentAmount').value),
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseInt(document.getElementById('bathrooms').value),
        area: document.getElementById('area').value.trim(),
        floor: document.getElementById('floor').value.trim() || 'Ground',
        description: document.getElementById('description').value.trim(),
        image: document.getElementById('imageUrl').value.trim(),
        status: document.querySelector('input[name="status"]:checked').value,
        landlordName: currentLandlord.name,
        landlordEmail: currentLandlord.email,
        landlordPhone: currentLandlord.phone || '+880 1712 345678'
    };
    
    if (!propertyData.title || !propertyData.location || !propertyData.rent || !propertyData.bedrooms || !propertyData.bathrooms || !propertyData.area || !propertyData.description || !propertyData.image) {
        alert('Please fill in all required fields');
        return;
    }
    
    let allProps = JSON.parse(localStorage.getItem('allProperties')) || [];
    
    if (editingPropertyId) {
        const index = allProps.findIndex(p => p.id === editingPropertyId);
        if (index !== -1) {
            allProps[index] = { ...allProps[index], ...propertyData };
        }
    } else {
        const newProperty = {
            id: Date.now(),
            ...propertyData,
            createdAt: new Date().toISOString()
        };
        allProps.push(newProperty);
    }
    
    localStorage.setItem('allProperties', JSON.stringify(allProps));
    
    hideAddPropertyForm();
    loadProperties();
    displayProperties();
    alert(editingPropertyId ? 'Property updated!' : 'Property added!');
}

function showDeleteModal(id) {
    deletePropertyId = id;
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletePropertyId = null;
}

function deleteProperty() {
    if (!deletePropertyId) return;
    
    let allProps = JSON.parse(localStorage.getItem('allProperties')) || [];
    allProps = allProps.filter(p => p.id !== deletePropertyId);
    localStorage.setItem('allProperties', JSON.stringify(allProps));
    
    closeDeleteModal();
    loadProperties();
    displayProperties();
    alert('Property deleted!');
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    initLandlordDashboard();
    setInterval(() => {
        const dateElem = document.getElementById('currentDateTime');
        if (dateElem) dateElem.innerHTML = new Date().toLocaleString();
    }, 1000);
    
    const form = document.getElementById('propertyForm');
    if (form) form.addEventListener('submit', saveProperty);
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) confirmBtn.addEventListener('click', deleteProperty);
});

// Make functions global
window.showAddPropertyForm = showAddPropertyForm;
window.hideAddPropertyForm = hideAddPropertyForm;
window.editProperty = editProperty;
window.showDeleteModal = showDeleteModal;
window.closeDeleteModal = closeDeleteModal;
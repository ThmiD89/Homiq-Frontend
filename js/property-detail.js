// ====================================
// HOMIQ - Property Detail JavaScript
// ====================================

// Get property ID from URL


function getPropertyId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Load property from localStorage or dummy data
function loadPropertyById(id) {
    const stored = localStorage.getItem('allProperties');
    if (stored) {
        const properties = JSON.parse(stored);
        return properties.find(p => p.id === id);
    }
    return null;
}

// Create thumbnail images array (using same image with different variations for demo)
function getGalleryImages(property) {
    const baseImage = property.image;
    // For demo, create 3 variations of the same image
    return [
        baseImage,
        baseImage.replace('text=', 'text=View+2'),
        baseImage.replace('text=', 'text=View+3')
    ];
}

// Display property details
function displayPropertyDetails(property) {
    if (!property) {
        showError();
        return;
    }
    
    // Update page title
    document.title = `${property.title} - HOMIQ`;
    
    // Property title
    const titleElement = document.getElementById('propertyTitle');
    if (titleElement) titleElement.textContent = property.title;
    
    // Location
    const locationElement = document.getElementById('propertyLocation');
    if (locationElement) locationElement.textContent = property.location;
    
    // Price
    const priceElement = document.getElementById('propertyPrice');
    if (priceElement) priceElement.innerHTML = `৳${property.rent.toLocaleString()} <span>/month</span>`;
    
    // Features
    const bedroomsElement = document.getElementById('featureBedrooms');
    if (bedroomsElement) bedroomsElement.innerHTML = `<strong>${property.bedrooms}</strong> Bedrooms`;
    
    const bathroomsElement = document.getElementById('featureBathrooms');
    if (bathroomsElement) bathroomsElement.innerHTML = `<strong>${property.bathrooms}</strong> Bathrooms`;
    
    const areaElement = document.getElementById('featureArea');
    if (areaElement) areaElement.innerHTML = `<strong>${property.area}</strong> Area`;
    
    const floorElement = document.getElementById('featureFloor');
    if (floorElement) floorElement.innerHTML = `<strong>${property.floor || 'N/A'}</strong> Floor`;
    
    // Description
    const descriptionElement = document.getElementById('propertyDescription');
    if (descriptionElement) descriptionElement.textContent = property.description;
    
    // Availability badge
    const badgeElement = document.getElementById('availabilityBadge');
    if (badgeElement) {
        const statusClass = property.status === 'available' ? 'badge-available' : 'badge-booked';
        const statusText = property.status === 'available' ? 'Available' : 'Booked';
        badgeElement.className = `badge ${statusClass}`;
        badgeElement.textContent = statusText;
    }
    
    // Landlord info (using demo data since landlord is not in property object)
    const landlordNameElement = document.getElementById('landlordName');
    const landlordPhoneElement = document.getElementById('landlordPhone');
    const landlordEmailElement = document.getElementById('landlordEmail');
    
    if (landlordNameElement) landlordNameElement.textContent = property.landlordName || 'Md. Rahman';
    if (landlordPhoneElement) landlordPhoneElement.textContent = property.landlordPhone || '+880 1712 345678';
    if (landlordEmailElement) landlordEmailElement.textContent = property.landlordEmail || 'landlord@homiq.com';
    
    // Show/hide contact and book buttons based on availability
    const actionButtons = document.getElementById('actionButtons');
    const bookedMessage = document.getElementById('bookedMessage');
    
    if (property.status === 'available') {
        if (actionButtons) actionButtons.style.display = 'flex';
        if (bookedMessage) bookedMessage.style.display = 'none';
    } else {
        if (actionButtons) actionButtons.style.display = 'none';
        if (bookedMessage) bookedMessage.style.display = 'block';
    }
    
    // Setup image gallery
    setupGallery(property);
}

// Setup image gallery
function setupGallery(property) {
    const images = getGalleryImages(property);
    const mainImage = document.getElementById('mainImage');
    const thumbnailStrip = document.getElementById('thumbnailStrip');
    
    if (!mainImage || !thumbnailStrip) return;
    
    // Set first image as main
    mainImage.src = images[0];
    mainImage.alt = property.title;
    
    // Create thumbnails
    thumbnailStrip.innerHTML = '';
    images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${img}" alt="View ${index + 1}">`;
        thumbnail.addEventListener('click', () => {
            // Update main image
            mainImage.src = img;
            // Update active state
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
        thumbnailStrip.appendChild(thumbnail);
    });
}

// Show error message
function showError() {
    const container = document.querySelector('.property-detail .container');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <div class="error-icon">🏠</div>
                <h2 class="error-title">Property Not Found</h2>
                <p class="error-text">The property you're looking for doesn't exist or has been removed.</p>
                <a href="listings.html" class="btn btn-primary">Browse Properties</a>
            </div>
        `;
    }
}

// Handle book now button
function setupBookButton(property) {
    const bookBtn = document.getElementById('bookNowBtn');
    if (!bookBtn) return;
    
    bookBtn.addEventListener('click', () => {
        // Save property to localStorage for payment page
        localStorage.setItem('bookingProperty', JSON.stringify({
            id: property.id,
            title: property.title,
            rent: property.rent,
            location: property.location
        }));
        // Redirect to payment page
        window.location.href = 'payment.html';
    });
}

// Handle contact button
function setupContactButton() {
    const contactBtn = document.getElementById('contactBtn');
    if (!contactBtn) return;
    
    contactBtn.addEventListener('click', () => {
        const phone = document.getElementById('landlordPhone')?.textContent;
        if (phone) {
            alert(`Contact landlord at: ${phone}`);
        } else {
            alert('Contact information is available after login');
        }
    });
}

// Handle back button
function setupBackButton() {
    const backLink = document.getElementById('backLink');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
}

// Initialize page
function initPropertyDetail() {
    const propertyId = getPropertyId();
    
    if (!propertyId) {
        showError();
        return;
    }
    
    const property = loadPropertyById(propertyId);
    
    if (!property) {
        showError();
        return;
    }
    
    displayPropertyDetails(property);
    setupBookButton(property);
    setupContactButton();
    setupBackButton();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPropertyDetail);
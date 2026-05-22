// ====================================
// HOMIQ - Home Page JavaScript
// ====================================

// Dummy featured properties data
const featuredProperties = [
    {
        id: 1,
        title: "Modern Apartment in Gulshan",
        location: "Gulshan-2, Dhaka",
        rent: 45000,
        bedrooms: 3,
        bathrooms: 2,
        area: "1350 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+1",
        status: "available",
        floor: 8,
        description: "Beautiful modern apartment with all amenities"
    },
    {
        id: 2,
        title: "Family Flat in Banani",
        location: "Banani, Dhaka",
        rent: 55000,
        bedrooms: 4,
        bathrooms: 3,
        area: "1650 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+2",
        status: "available",
        floor: 5,
        description: "Spacious family apartment near Banani DOHS"
    },
    {
        id: 3,
        title: "Cozy Studio in Uttara",
        location: "Uttara Sector-10, Dhaka",
        rent: 18000,
        bedrooms: 1,
        bathrooms: 1,
        area: "550 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+3",
        status: "booked",
        floor: 3,
        description: "Perfect for单身 professionals"
    },
    {
        id: 4,
        title: "Luxury Penthouse in Dhanmondi",
        location: "Dhanmondi-32, Dhaka",
        rent: 85000,
        bedrooms: 4,
        bathrooms: 4,
        area: "2200 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+4",
        status: "available",
        floor: 12,
        description: "Luxury penthouse with rooftop access"
    },
    {
        id: 5,
        title: "Affordable Flat in Mirpur",
        location: "Mirpur-12, Dhaka",
        rent: 15000,
        bedrooms: 2,
        bathrooms: 1,
        area: "750 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+5",
        status: "available",
        floor: 4,
        description: "Affordable family apartment"
    },
    {
        id: 6,
        title: "Studio Apartment in Bashundhara",
        location: "Bashundhara R/A, Dhaka",
        rent: 25000,
        bedrooms: 2,
        bathrooms: 2,
        area: "900 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+6",
        status: "available",
        floor: 7,
        description: "Modern studio near shopping mall"
    },
    {
        id: 7,
        title: "3-Bedroom Flat in Mohammadpur",
        location: "Mohammadpur, Dhaka",
        rent: 22000,
        bedrooms: 3,
        bathrooms: 2,
        area: "1100 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+7",
        status: "booked",
        floor: 6,
        description: "Well-maintained family apartment"
    },
    {
        id: 8,
        title: "Premium Apartment in Baridhara",
        location: "Baridhara DOHS, Dhaka",
        rent: 65000,
        bedrooms: 3,
        bathrooms: 3,
        area: "1550 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Apartment+8",
        status: "available",
        floor: 9,
        description: "Premium location with park view"
    }
];

// Function to create property card HTML
function createPropertyCard(property) {
    const statusClass = property.status === 'available' ? 'badge-available' : 'badge-booked';
    const statusText = property.status === 'available' ? 'Available' : 'Booked';
    
    return `
        <div class="property-card" data-id="${property.id}">
            <div class="property-card-image">
                <img src="${property.image}" alt="${property.title}">
                <div class="property-badge">
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="property-card-content">
                <h3 class="property-card-title">${property.title}</h3>
                <div class="property-card-location">
                    📍 ${property.location}
                </div>
                <div class="property-card-price">
                    ৳${property.rent.toLocaleString()} <span>/month</span>
                </div>
                <div class="property-card-details">
                    <span>🛏️ ${property.bedrooms}</span>
                    <span>🚿 ${property.bathrooms}</span>
                    <span>📐 ${property.area}</span>
                </div>
            </div>
        </div>
    `;
}

// Function to display featured properties
function displayFeaturedProperties() {
    const gridContainer = document.getElementById('featuredGrid');
    if (!gridContainer) return;
    
    // Show only first 4 properties on home page
    const featured = featuredProperties.slice(0, 4);
    
    gridContainer.innerHTML = featured.map(property => createPropertyCard(property)).join('');
    
    // Add click event to each card
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', () => {
            const propertyId = card.dataset.id;
            window.location.href = `pages/property-detail.html?id=${propertyId}`;
        });
    });
}

// Function to handle search from home page
function setupHomeSearch() {
    const searchInput = document.getElementById('homeSearchInput');
    const searchBtn = document.getElementById('homeSearchBtn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                localStorage.setItem('homeSearchTerm', searchTerm);
                window.location.href = 'pages/listings.html';
            } else {
                window.location.href = 'pages/listings.html';
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    localStorage.setItem('homeSearchTerm', searchTerm);
                    window.location.href = 'pages/listings.html';
                } else {
                    window.location.href = 'pages/listings.html';
                }
            }
        });
    }
}

// Store featured properties in localStorage for other pages to use
function storePropertiesData() {
    if (!localStorage.getItem('allProperties')) {
        localStorage.setItem('allProperties', JSON.stringify(featuredProperties));
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProperties();
    setupHomeSearch();
    storePropertiesData();
});
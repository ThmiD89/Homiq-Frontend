// ====================================
// HOMIQ - Listings Page JavaScript
// ====================================

// Global variables
let allProperties = [];
let currentProperties = [];
let currentPage = 1;
const itemsPerPage = 9;

// ====================================
// DUMMY PROPERTIES DATA
// ====================================

const dummyProperties = [
    {
        id: 1,
        title: "Modern Apartment in Gulshan",
        location: "Gulshan-2, Dhaka",
        rent: 45000,
        bedrooms: 3,
        bathrooms: 2,
        area: "1350 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Gulshan+Apartment",
        status: "available",
        floor: 8,
        description: "Beautiful modern apartment with all amenities, 24/7 security, parking, and backup generator."
    },
    {
        id: 2,
        title: "Family Flat in Banani",
        location: "Banani, Dhaka",
        rent: 55000,
        bedrooms: 4,
        bathrooms: 3,
        area: "1650 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Banani+Flat",
        status: "available",
        floor: 5,
        description: "Spacious family apartment near Banani DOHS, close to schools and shopping malls."
    },
    {
        id: 3,
        title: "Cozy Studio in Uttara",
        location: "Uttara Sector-10, Dhaka",
        rent: 18000,
        bedrooms: 1,
        bathrooms: 1,
        area: "550 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Uttara+Studio",
        status: "booked",
        floor: 3,
        description: "Perfect for singles or couples, fully furnished, near metro station."
    },
    {
        id: 4,
        title: "Luxury Penthouse in Dhanmondi",
        location: "Dhanmondi-32, Dhaka",
        rent: 85000,
        bedrooms: 4,
        bathrooms: 4,
        area: "2200 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Dhanmondi+Penthouse",
        status: "available",
        floor: 12,
        description: "Luxury penthouse with rooftop access, private terrace, and city view."
    },
    {
        id: 5,
        title: "Affordable Flat in Mirpur",
        location: "Mirpur-12, Dhaka",
        rent: 15000,
        bedrooms: 2,
        bathrooms: 1,
        area: "750 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Mirpur+Flat",
        status: "available",
        floor: 4,
        description: "Affordable family apartment, close to shopping malls and restaurants."
    },
    {
        id: 6,
        title: "Studio Apartment in Bashundhara",
        location: "Bashundhara R/A, Dhaka",
        rent: 25000,
        bedrooms: 2,
        bathrooms: 2,
        area: "900 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Bashundhara+Studio",
        status: "available",
        floor: 7,
        description: "Modern studio near shopping mall, perfect for professionals."
    },
    {
        id: 7,
        title: "3-Bedroom Flat in Mohammadpur",
        location: "Mohammadpur, Dhaka",
        rent: 22000,
        bedrooms: 3,
        bathrooms: 2,
        area: "1100 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Mohammadpur+Flat",
        status: "booked",
        floor: 6,
        description: "Well-maintained family apartment with park view."
    },
    {
        id: 8,
        title: "Premium Apartment in Baridhara",
        location: "Baridhara DOHS, Dhaka",
        rent: 65000,
        bedrooms: 3,
        bathrooms: 3,
        area: "1550 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Baridhara+Apartment",
        status: "available",
        floor: 9,
        description: "Premium location with park view, diplomatic zone."
    },
    {
        id: 9,
        title: "Economy Flat in Khilgaon",
        location: "Khilgaon, Dhaka",
        rent: 12000,
        bedrooms: 2,
        bathrooms: 1,
        area: "650 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Khilgaon+Flat",
        status: "available",
        floor: 3,
        description: "Budget-friendly flat, good for small families."
    },
    {
        id: 10,
        title: "Luxury Apartment in Gulshan-1",
        location: "Gulshan-1, Dhaka",
        rent: 75000,
        bedrooms: 3,
        bathrooms: 3,
        area: "1800 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Gulshan+Luxury",
        status: "available",
        floor: 15,
        description: "High-end apartment with swimming pool and gym."
    },
    {
        id: 11,
        title: "Family Home in Uttara Sector-4",
        location: "Uttara Sector-4, Dhaka",
        rent: 35000,
        bedrooms: 4,
        bathrooms: 3,
        area: "1450 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Uttara+Family+Home",
        status: "available",
        floor: 2,
        description: "Spacious family home with garden."
    },
    {
        id: 12,
        title: "Studio in Dhanmondi-27",
        location: "Dhanmondi-27, Dhaka",
        rent: 28000,
        bedrooms: 1,
        bathrooms: 1,
        area: "600 sqft",
        image: "https://placehold.co/400x300/e5e7eb/1f2937?text=Dhanmondi+Studio",
        status: "booked",
        floor: 10,
        description: "Cozy studio with great city view."
    }
];

// ====================================
// HELPER FUNCTIONS
// ====================================

// Load properties from localStorage or use dummy data
function loadProperties() {
    const stored = localStorage.getItem('allProperties');
    if (stored) {
        allProperties = JSON.parse(stored);
    } else {
        allProperties = [...dummyProperties];
        localStorage.setItem('allProperties', JSON.stringify(allProperties));
    }
    currentProperties = [...allProperties];
}

// Save properties to localStorage
function saveProperties() {
    localStorage.setItem('allProperties', JSON.stringify(allProperties));
}

// Create property card HTML
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

// Display properties with pagination
function displayProperties() {
    const gridContainer = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!gridContainer) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProperties = currentProperties.slice(start, end);
    
    if (paginatedProperties.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1;">
                <div class="no-results-icon">🏠</div>
                <h3 class="no-results-title">No Properties Found</h3>
                <p class="no-results-text">Try adjusting your filters or search criteria.</p>
            </div>
        `;
    } else {
        gridContainer.innerHTML = paginatedProperties.map(property => createPropertyCard(property)).join('');
    }
    
    // Update results count
    if (resultsCount) {
        resultsCount.innerHTML = `<span>${currentProperties.length}</span> properties found`;
    }
    
    // Update pagination
    updatePagination();
    
    // Add click listeners to property cards
    document.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', () => {
            const propertyId = parseInt(card.dataset.id);
            window.location.href = `property-detail.html?id=${propertyId}`;
        });
    });
}

// Update pagination buttons
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(currentProperties.length / itemsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
            ←
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-dots">...</span>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
            →
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Add click listeners
    document.querySelectorAll('.page-btn').forEach(btn => {
        if (!btn.disabled) {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    displayProperties();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    });
}

// ====================================
// FILTER FUNCTIONS
// ====================================

function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const locationFilter = document.getElementById('locationFilter')?.value.toLowerCase() || '';
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    const statusFilter = document.querySelector('input[name="status"]:checked')?.value || 'all';
    const selectedBedrooms = document.querySelector('.bedroom-btn.active')?.dataset.bedrooms;
    
    let filtered = [...allProperties];
    
    // Search term filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(searchTerm) || 
            p.location.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Location filter
    if (locationFilter) {
        filtered = filtered.filter(p => p.location.toLowerCase().includes(locationFilter));
    }
    
    // Price filter
    filtered = filtered.filter(p => p.rent >= minPrice && p.rent <= maxPrice);
    
    // Status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    // Bedrooms filter
    if (selectedBedrooms && selectedBedrooms !== 'all') {
        const bedroomCount = parseInt(selectedBedrooms);
        filtered = filtered.filter(p => p.bedrooms === bedroomCount);
    }
    
    currentProperties = filtered;
    currentPage = 1;
    displayProperties();
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const statusAll = document.getElementById('statusAll');
    const bedroomBtns = document.querySelectorAll('.bedroom-btn');
    
    if (searchInput) searchInput.value = '';
    if (locationFilter) locationFilter.value = '';
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    if (statusAll) statusAll.checked = true;
    
    bedroomBtns.forEach(btn => btn.classList.remove('active'));
    const allBedroomsBtn = document.querySelector('.bedroom-btn[data-bedrooms="all"]');
    if (allBedroomsBtn) allBedroomsBtn.classList.add('active');
    
    currentProperties = [...allProperties];
    currentPage = 1;
    displayProperties();
}

function setupBedroomButtons() {
    const buttons = document.querySelectorAll('.bedroom-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilters();
        });
    });
}

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        
        switch(sortBy) {
            case 'price_asc':
                currentProperties.sort((a, b) => a.rent - b.rent);
                break;
            case 'price_desc':
                currentProperties.sort((a, b) => b.rent - a.rent);
                break;
            case 'newest':
                currentProperties.sort((a, b) => b.id - a.id);
                break;
            default:
                currentProperties.sort((a, b) => a.id - b.id);
        }
        
        currentPage = 1;
        displayProperties();
    });
}

// ====================================
// INITIALIZATION
// ====================================

function initListings() {
    loadProperties();
    
    // Check for search term from home page
    const savedSearch = localStorage.getItem('homeSearchTerm');
    if (savedSearch) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = savedSearch;
            localStorage.removeItem('homeSearchTerm');
        }
    }
    
    currentProperties = [...allProperties];
    displayProperties();
    setupBedroomButtons();
    setupSorting();
    
    // Apply filters button
    const applyBtn = document.getElementById('applyFilters');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }
    
    // Clear filters button
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
    
    // Real-time search (optional)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initListings);
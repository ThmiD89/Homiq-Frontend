# Homiq-Frontend

# README.md for HOMIQ (Frontend Only)

**File location:** `homiq/README.md`

```markdown
# 🏠 HOMIQ - Online Home Rental Platform (Frontend Demo)

![HOMIQ Banner](https://placehold.co/1200x400/10B981/FFFFFF?text=HOMIQ+-+Find+Your+Perfect+Home)

## 📌 Project Overview

**HOMIQ** is a fully functional frontend web application that simulates a complete home rental platform. It demonstrates all user interfaces and interactions for landlords, tenants, and administrators using HTML, CSS, and JavaScript with localStorage for data persistence.

> **Note:** This is a frontend-only demo project. All data is stored in the browser's localStorage. No backend server or database is required to run this application.

---

## 🎯 Purpose

This project showcases the complete user experience of a rental platform including:

- User authentication with role-based dashboards
- Property listing and management
- Property search and filtering
- Booking and payment simulation
- Admin management features

---

## ✨ Features Implemented

### 🔐 Authentication System
| Feature | Status |
|---------|--------|
| User Registration (Tenant/Landlord) | ✅ Complete |
| Secure Login with Role Detection | ✅ Complete |
| Password Strength Meter | ✅ Complete |
| Password Visibility Toggle | ✅ Complete |
| Forgot Password with OTP (Demo) | ✅ Complete |
| Terms & Privacy Policy Modals | ✅ Complete |

### 🏠 Home Page
| Feature | Status |
|---------|--------|
| Hero Section with Search Bar | ✅ Complete |
| Featured Properties Grid | ✅ Complete |
| How It Works Section | ✅ Complete |
| Dynamic CTA Buttons (based on login state) | ✅ Complete |
| Fully Responsive Design | ✅ Complete |

### 🔍 Property Listings Page
| Feature | Status |
|---------|--------|
| Property Cards Grid Display | ✅ Complete |
| Search by Title/Location | ✅ Complete |
| Filter by Price Range | ✅ Complete |
| Filter by Availability (Available/Booked) | ✅ Complete |
| Filter by Bedrooms | ✅ Complete |
| Sort by Price (Low-High / High-Low) | ✅ Complete |
| Pagination | ✅ Complete |
| Click Card to View Details | ✅ Complete |

### 📄 Property Detail Page
| Feature | Status |
|---------|--------|
| Image Gallery with Thumbnails | ✅ Complete |
| Full Property Information Display | ✅ Complete |
| Availability Status Badge | ✅ Complete |
| Landlord Contact Information | ✅ Complete |
| "Book Now" Button (redirects to payment) | ✅ Complete |
| "Contact Landlord" Button | ✅ Complete |

### 👨‍💼 Landlord Dashboard
| Feature | Status |
|---------|--------|
| Dashboard Stats (Total Properties, Available, Booked, Earnings) | ✅ Complete |
| View All My Properties | ✅ Complete |
| Add New Property Form | ✅ Complete |
| Edit Property Functionality | ✅ Complete |
| Delete Property with Confirmation | ✅ Complete |
| Image Preview on Add/Edit | ✅ Complete |

### 👤 Tenant Dashboard
| Feature | Status |
|---------|--------|
| Dashboard Stats (Total Bookings, Active Bookings, Total Spent) | ✅ Complete |
| View Active Bookings | ✅ Complete |
| View Booking History | ✅ Complete |
| Cancel Booking Functionality | ✅ Complete |
| Profile Information Display | ✅ Complete |

### 💳 Payment Page
| Feature | Status |
|---------|--------|
| Payment Summary Display | ✅ Complete |
| Multiple Payment Methods (bKash, Nagad, Card, SSLCommerz) | ✅ Complete |
| Dynamic Form Fields per Method | ✅ Complete |
| Transaction ID Validation | ✅ Complete |
| Success/Failure Message | ✅ Complete |
| Automatic Property Status Update | ✅ Complete |

### 👑 Admin Dashboard
| Feature | Status |
|---------|--------|
| System Statistics Cards | ✅ Complete |
| User Management (View, Search, Filter, Delete) | ✅ Complete |
| Property Management (View, Search, Filter, Status Toggle, Delete) | ✅ Complete |
| Payment History Tracking | ✅ Complete |
| Generate Reports (CSV Export) | ✅ Complete |
| Export All Data (JSON) | ✅ Complete |
| System Statistics Modal | ✅ Complete |

### 🎨 UI/UX Features
| Feature | Status |
|---------|--------|
| Responsive Design (Mobile, Tablet, Desktop) | ✅ Complete |
| Mobile Hamburger Menu | ✅ Complete |
| Modern CSS with Variables | ✅ Complete |
| Smooth Hover Effects | ✅ Complete |
| Loading States | ✅ Complete |
| Toast Notifications | ✅ Complete |
| Confirmation Modals | ✅ Complete |
| Active Page Highlighting | ✅ Complete |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **HTML** | HTML5 |
| **CSS** | CSS3 (Flexbox, Grid, CSS Variables, Media Queries) |
| **JavaScript** | Vanilla JavaScript (ES6+) |
| **Data Storage** | Browser localStorage |
| **Icons** | Emoji icons |
| **Version Control** | Git |

### Color Palette
| Color | Code | Usage |
|-------|------|-------|
| Green | `#10B981` | Primary buttons, available badge, accents |
| Green Dark | `#059669` | Button hover states |
| Gold | `#F59E0B` | Highlights, premium feel, logo accent |
| White | `#FFFFFF` | Backgrounds, cards |
| Dark Gray | `#1F2937` | Text, headings |

---

## 📁 Project Structure

```
homiq/
├── index.html                 # Home page
├── css/
│   ├── global.css            # Global styles & CSS variables
│   ├── home.css              # Home page styles
│   ├── auth.css              # Login/Register styles
│   ├── listings.css          # Listings page styles
│   ├── property-detail.css   # Property detail styles
│   ├── dashboard.css         # All dashboard styles
│   └── payment.css           # Payment page styles
├── js/
│   ├── main.js               # Navbar, footer, auth state
│   ├── auth.js               # Login/Register logic
│   ├── home.js               # Home page logic
│   ├── listings.js           # Listings & filtering
│   ├── property-detail.js    # Property detail logic
│   ├── dashboard.js          # Landlord dashboard
│   ├── admin.js              # Admin dashboard
│   ├── tenant-dashboard.js   # Tenant dashboard
│   └── payment.js            # Payment processing
└── pages/
    ├── login.html
    ├── register.html
    ├── listings.html
    ├── property-detail.html
    ├── landlord-dashboard.html
    ├── tenant-dashboard.html
    ├── admin-dashboard.html
    ├── payment.html
    ├── forgot-password.html
    ├── otp-verification.html
    └── reset-password.html
```

---

## 🚀 Installation & Setup

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No server required - works directly in browser

### Step 1: Download or Clone
```bash
git clone https://github.com/yourusername/homiq.git
cd homiq
```

### Step 2: Open the Application
```bash
# Simply open index.html in your browser
# Or use Live Server extension in VS Code
```

### Step 3: Start Using
- No installation or backend setup required
- All data is stored in your browser's localStorage

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@homiq.com | admin123 |
| **Landlord** | Register as landlord | (your password) |
| **Tenant** | Register as tenant | (your password) |

> **Note:** The default admin account is automatically created when you first run the application.

---

## 📖 How to Use (End-to-End Flow)

### For Tenants

1. **Register**
   - Go to Register page
   - Select "Tenant" role
   - Fill all details (name, email, phone, password)
   - Click "Send Code" (demo code appears)
   - Enter verification code
   - Agree to terms
   - Click "Create Account"

2. **Login**
   - Go to Login page
   - Enter email and password
   - Click Login

3. **Browse Properties**
   - View all properties on Listings page
   - Use filters (location, price, bedrooms, availability)
   - Sort properties by price

4. **Book a Property**
   - Click on any property card
   - View full details and landlord contact
   - Click "Book Now"
   - Select payment method
   - Enter transaction ID (any text works for demo)
   - Click "Confirm Payment"

5. **Manage Bookings**
   - Go to Tenant Dashboard
   - View active bookings
   - Cancel bookings if needed
   - View booking history

### For Landlords

1. **Register** as Landlord (similar to tenant)
2. **Login** to access Landlord Dashboard
3. **Add Property** - Fill all details (title, location, rent, images, etc.)
4. **Manage Properties** - Edit or delete your listings
5. **Track Earnings** - View stats on dashboard

### For Admins

1. **Login** with `admin@homiq.com` / `admin123`
2. **View Statistics** - See platform stats on dashboard
3. **Manage Users** - View, search, filter, delete users
4. **Manage Properties** - View all properties, change status, delete
5. **Generate Reports** - Download CSV reports
6. **Export Data** - Download all data as JSON

---

## 🧪 Demo Data

The application comes with **12 pre-loaded demo properties** including:

| Property | Location | Rent | Status |
|----------|----------|------|--------|
| Modern Apartment in Gulshan | Gulshan-2, Dhaka | ৳45,000 | Available |
| Family Flat in Banani | Banani, Dhaka | ৳55,000 | Available |
| Cozy Studio in Uttara | Uttara Sector-10, Dhaka | ৳18,000 | Booked |
| Luxury Penthouse in Dhanmondi | Dhanmondi-32, Dhaka | ৳85,000 | Available |
| And 8 more properties... | | | |

---

## 📱 Responsive Breakpoints

| Device | Breakpoint | Grid Columns |
|--------|------------|--------------|
| Desktop | > 1024px | 3-4 columns |
| Tablet | 768px - 1024px | 2 columns |
| Mobile | < 768px | 1 column |

---

## 🔒 Data Storage (localStorage)

All data is stored in your browser's localStorage. Keys used:

| Key | Description |
|-----|-------------|
| `users` | All registered users |
| `detailedUsers` | Detailed user information |
| `allProperties` | All property listings |
| `paymentHistory` | All payment transactions |
| `currentUser` | Currently logged in user |
| `userRole` | Role of logged in user |

### Clear All Data
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```

---

## 🎨 Screenshots Description

| Page | Content |
|------|---------|
| **Home** | Hero section, search bar, featured properties, how it works, CTA section |
| **Login** | Email, password fields, forgot password link |
| **Register** | Role selector, basic info, role-specific fields, verification |
| **Listings** | Filter sidebar, property cards grid, search, sort, pagination |
| **Property Detail** | Image gallery, full details, landlord card, booking button |
| **Landlord Dashboard** | Stats cards, properties list, add/edit property form |
| **Tenant Dashboard** | Stats cards, active bookings, history, profile |
| **Admin Dashboard** | Stats, quick actions, user table, property table |
| **Payment** | Payment summary, method selector, transaction input |

---

## 🚧 Limitations (Frontend Only)

Since this is a frontend-only demo:

| Feature | Status |
|---------|--------|
| Email sending for verification | ❌ Simulated (code shown in console) |
| Real payment processing | ❌ Simulated (any transaction ID works) |
| Image upload | ❌ Uses image URLs instead |
| Real-time notifications | ❌ Not implemented |
| Backend API | ❌ All data in localStorage |

---

## 👨‍💻 Contributors

| Name | ID | Role |
|------|-----|------|
| Tahmid Ezaz | 2304013 | Frontend Developer |
| Abdullah Al Wasif | 2304019 | Frontend Developer |
| Rubaya Hasan | 2304035 | Frontend Developer |

### Course Information
- **Course:** CSE 202 (Database Management System Sessional), PROG 212 (Android & Web Application Development Sessional), SEC 204 (Threat Modeling & Security Monitoring Sessional)
- **Session:** 2023-24
- **Department:** Cyber Security Engineering
- **University:** University of Frontier Technology, Bangladesh

### Instructors
- Rakib Hossen (Assistant Professor)
- Md Masud Rana (Lecturer)
- Md Abdullah (Lecturer)

---

## 📄 License

This project is developed for academic purposes as part of the course requirements at the University of Frontier Technology, Bangladesh.

---

## 🙏 Acknowledgments

- University of Frontier Technology, Bangladesh
- Department of Cyber Security Engineering
- All course instructors for their guidance
- Open source community for inspiration

---

## 📞 Contact

For any queries regarding this project:

- **Email:** support@homiq.com (demo)
- **GitHub:** [Your GitHub Profile Link]

---

## 📌 Version

**Version:** 1.0.0 (Frontend Demo)
**Last Updated:** December 2024

---

## ⭐ Quick Demo Guide

```bash
# 1. Open index.html
# 2. Register as a tenant
# 3. Login and browse properties
# 4. Book a property
# 5. View your dashboard
# 6. Login as admin (admin@homiq.com / admin123) to manage everything
```

---

**Built with ❤️ using HTML, CSS, and JavaScript**

*HOMIQ - Find Your Perfect Home*
```

---

## What to do:

1. **Create** `README.md` in your `homiq/` folder
2. **Copy** the entire code above
3. **Paste** into the file
4. **Save**
5. **Commit and push** to GitHub

The README now accurately reflects that this is a **frontend-only demo** with localStorage for data persistence!

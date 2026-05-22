// ====================================
// HOMIQ - Payment JavaScript
// ====================================

// Global variables
let bookingProperty = null;

// ====================================
// LOAD BOOKING DATA
// ====================================

function loadBookingData() {
    const stored = localStorage.getItem('bookingProperty');
    if (!stored) {
        showMessage('No booking information found. Please try again.', 'error');
        setTimeout(() => {
            window.location.href = 'listings.html';
        }, 2000);
        return false;
    }
    
    bookingProperty = JSON.parse(stored);
    displayPaymentSummary();
    return true;
}

function displayPaymentSummary() {
    if (!bookingProperty) return;
    
    // Property name
    const propNameElement = document.getElementById('summaryPropertyName');
    if (propNameElement) propNameElement.textContent = bookingProperty.title;
    
    // Property location
    const propLocationElement = document.getElementById('summaryPropertyLocation');
    if (propLocationElement) propLocationElement.textContent = bookingProperty.location;
    
    // Rent amount
    const rentAmountElement = document.getElementById('rentAmount');
    if (rentAmountElement) rentAmountElement.textContent = `৳${bookingProperty.rent.toLocaleString()}`;
    
    // Service fee (2% for demo)
    const serviceFee = Math.round(bookingProperty.rent * 0.02);
    const serviceFeeElement = document.getElementById('serviceFee');
    if (serviceFeeElement) serviceFeeElement.textContent = `৳${serviceFee.toLocaleString()}`;
    
    // Total amount
    const total = bookingProperty.rent + serviceFee;
    const totalElement = document.getElementById('totalAmount');
    if (totalElement) totalElement.textContent = `৳${total.toLocaleString()}`;
    
    // Store total for later use
    localStorage.setItem('paymentTotal', total);
}

// ====================================
// PAYMENT METHOD HANDLING
// ====================================

function setupPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.getElementById('paymentDetails');
    
    methods.forEach(method => {
        const input = method.querySelector('.method-input');
        input.addEventListener('change', () => {
            const selectedMethod = input.value;
            updatePaymentDetailsForm(selectedMethod);
        });
    });
}

function updatePaymentDetailsForm(method) {
    const detailsContainer = document.getElementById('dynamicDetails');
    if (!detailsContainer) return;
    
    let html = '';
    
    switch(method) {
        case 'bkash':
            html = `
                <div class="transaction-group">
                    <label class="transaction-label">bKash Transaction ID</label>
                    <input type="text" id="transactionId" class="transaction-input" placeholder="Enter your bKash transaction ID">
                    <p class="help-text">Send money to 017XXXXXXXX (HOMIQ) and enter the transaction ID</p>
                </div>
                <div class="transaction-group">
                    <label class="transaction-label">bKash Number</label>
                    <input type="text" id="bkashNumber" class="transaction-input" placeholder="Enter your bKash number">
                </div>
            `;
            break;
        case 'nagad':
            html = `
                <div class="transaction-group">
                    <label class="transaction-label">Nagad Transaction ID</label>
                    <input type="text" id="transactionId" class="transaction-input" placeholder="Enter your Nagad transaction ID">
                    <p class="help-text">Send money to 017XXXXXXXX (HOMIQ) and enter the transaction ID</p>
                </div>
                <div class="transaction-group">
                    <label class="transaction-label">Nagad Number</label>
                    <input type="text" id="nagadNumber" class="transaction-input" placeholder="Enter your Nagad number">
                </div>
            `;
            break;
        case 'card':
            html = `
                <div class="transaction-group">
                    <label class="transaction-label">Card Number</label>
                    <input type="text" id="cardNumber" class="transaction-input" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="transaction-group">
                    <label class="transaction-label">Expiry Date</label>
                    <input type="text" id="expiryDate" class="transaction-input" placeholder="MM/YY">
                </div>
                <div class="transaction-group">
                    <label class="transaction-label">CVV</label>
                    <input type="password" id="cvv" class="transaction-input" placeholder="123" maxlength="3">
                </div>
            `;
            break;
        case 'sslcommerz':
            html = `
                <div class="transaction-group">
                    <label class="transaction-label">Transaction ID</label>
                    <input type="text" id="transactionId" class="transaction-input" placeholder="Enter SSLCommerz transaction ID">
                    <p class="help-text">You will be redirected to SSLCommerz secure payment gateway</p>
                </div>
            `;
            break;
        default:
            html = `
                <div class="transaction-group">
                    <label class="transaction-label">Transaction ID</label>
                    <input type="text" id="transactionId" class="transaction-input" placeholder="Enter your transaction ID">
                </div>
            `;
    }
    
    detailsContainer.innerHTML = html;
}

// ====================================
// PAYMENT PROCESSING
// ====================================

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

function showMessage(message, type = 'success') {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button class="message-close">&times;</button>
    `;
    
    container.appendChild(messageDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
    
    // Close button
    messageDiv.querySelector('.message-close').addEventListener('click', () => {
        messageDiv.remove();
    });
}

function getTransactionId() {
    // Try to get from common field
    const transInput = document.getElementById('transactionId');
    if (transInput) return transInput.value.trim();
    
    // For card payments, use card number as reference
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) return `CARD_${cardInput.value.slice(-4)}`;
    
    return null;
}

function validatePayment() {
    const selectedMethod = document.querySelector('.method-input:checked');
    if (!selectedMethod) {
        showMessage('Please select a payment method', 'error');
        return false;
    }
    
    const transactionId = getTransactionId();
    if (!transactionId) {
        showMessage('Please enter transaction ID / payment details', 'error');
        return false;
    }
    
    if (transactionId.length < 3) {
        showMessage('Please enter a valid transaction ID', 'error');
        return false;
    }
    
    return true;
}

function processPayment() {
    if (!validatePayment()) return;
    
    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        showLoading(false);
        
        // Get selected method for demo
        const selectedMethod = document.querySelector('.method-input:checked');
        const methodName = selectedMethod ? selectedMethod.value : 'unknown';
        
        // Generate random success/failure (90% success for demo)
        const isSuccess = Math.random() < 0.9;
        
        if (isSuccess) {
            // Payment success
            const transactionId = getTransactionId();
            
            // Update property status to booked
            updatePropertyStatus(bookingProperty.id);
            
            // Save payment record
savePaymentRecord({
    propertyId: bookingProperty.id,
    propertyTitle: bookingProperty.title,
    propertyLocation: bookingProperty.location,
    propertyImage: bookingProperty.image,
    amount: localStorage.getItem('paymentTotal'),
    transactionId: transactionId,
    method: methodName,
    tenantName: currentUser.name,
    tenantEmail: currentUser.email,
    date: new Date().toISOString(),
    status: 'active'
});
            
            showMessage('Payment successful! Booking confirmed.', 'success');
            
            // Clear booking data
            localStorage.removeItem('bookingProperty');
            localStorage.removeItem('paymentTotal');
            
            // Redirect to success page or property detail
            setTimeout(() => {
                window.location.href = `property-detail.html?id=${bookingProperty.id}`;
            }, 2000);
        } else {
            // Payment failed
            showMessage('Payment failed. Please try again.', 'error');
        }
    }, 2000);
}

function updatePropertyStatus(propertyId) {
    const stored = localStorage.getItem('allProperties');
    if (stored) {
        let properties = JSON.parse(stored);
        const index = properties.findIndex(p => p.id === propertyId);
        if (index !== -1) {
            properties[index].status = 'booked';
            localStorage.setItem('allProperties', JSON.stringify(properties));
        }
    }
}

function savePaymentRecord(payment) {
    let payments = JSON.parse(localStorage.getItem('paymentHistory')) || [];
    payments.push(payment);
    localStorage.setItem('paymentHistory', JSON.stringify(payments));
}

// ====================================
// INITIALIZATION
// ====================================

function initPayment() {
    if (!loadBookingData()) return;
    
    setupPaymentMethods();
    
    // Select default payment method (bKash)
    const defaultMethod = document.querySelector('.method-input[value="bkash"]');
    if (defaultMethod) {
        defaultMethod.checked = true;
        updatePaymentDetailsForm('bkash');
    }
    
    // Confirm button
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', processPayment);
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Cancel payment and go back?')) {
                window.location.href = `property-detail.html?id=${bookingProperty.id}`;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initPayment);
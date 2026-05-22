// ====================================
// HOMIQ - Authentication JavaScript
// Complete Working Version with Detailed User Info
// ====================================

// ========== HELPER FUNCTIONS ==========

function showAlert(message, type = 'error') {
    // Remove existing alert
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    // Create alert div
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert at top of form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(alertDiv, form.firstChild);
    } else {
        document.querySelector('.auth-body')?.insertBefore(alertDiv, document.querySelector('.auth-body').firstChild);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv) alertDiv.remove();
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function updateStrengthMeter(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthFill || !strengthText) return;
    
    const strength = checkPasswordStrength(password);
    
    // Reset classes
    strengthFill.classList.remove('weak', 'medium', 'strong');
    strengthFill.classList.add(strength);
    
    // Set width based on strength
    if (strength === 'weak') {
        strengthFill.style.width = '33%';
        strengthText.textContent = 'Weak password';
        strengthText.style.color = '#EF4444';
    } else if (strength === 'medium') {
        strengthFill.style.width = '66%';
        strengthText.textContent = 'Medium password';
        strengthText.style.color = '#F59E0B';
    } else {
        strengthFill.style.width = '100%';
        strengthText.textContent = 'Strong password';
        strengthText.style.color = '#10B981';
    }
}

// ========== PASSWORD VISIBILITY TOGGLE ==========

function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input && input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else if (input && input.type === 'text') {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
}

// ========== ROLE TOGGLE ==========

function setupRoleToggle() {
    const roleTenant = document.getElementById('roleTenant');
    const roleLandlord = document.getElementById('roleLandlord');
    const tenantFields = document.getElementById('tenantFields');
    const landlordFields = document.getElementById('landlordFields');
    
    if (!roleTenant || !roleLandlord) return;
    
    function toggleFields() {
        if (roleTenant.checked) {
            if (tenantFields) tenantFields.style.display = 'block';
            if (landlordFields) landlordFields.style.display = 'none';
        } else {
            if (tenantFields) tenantFields.style.display = 'none';
            if (landlordFields) landlordFields.style.display = 'block';
        }
    }
    
    roleTenant.addEventListener('change', toggleFields);
    roleLandlord.addEventListener('change', toggleFields);
    toggleFields();
}

// ========== VERIFICATION CODE ==========

let generatedVerificationCode = null;
let verificationCodeSent = false;

function setupVerificationCode() {
    const sendBtn = document.getElementById('sendVerificationCodeBtn');
    const codeInput = document.getElementById('verificationCode');
    const verificationHint = document.getElementById('verificationHint');
    
    if (!sendBtn) return;
    
    sendBtn.addEventListener('click', function() {
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        
        if (!email && !phone) {
            showAlert('Please enter email or phone number first', 'error');
            return;
        }
        
        generatedVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', generatedVerificationCode);
        localStorage.setItem('verificationExpiry', Date.now() + 10 * 60 * 1000);
        
        console.log(`Verification Code: ${generatedVerificationCode}`);
        
        if (verificationHint) {
            verificationHint.innerHTML = `✅ Demo Code: <strong>${generatedVerificationCode}</strong> sent to ${email || phone}. Expires in 10 minutes.`;
            verificationHint.style.color = '#10B981';
        }
        
        if (codeInput) codeInput.disabled = false;
        verificationCodeSent = true;
        sendBtn.disabled = true;
        sendBtn.textContent = 'Code Sent';
        sendBtn.style.opacity = '0.6';
        
        setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Resend Code';
            sendBtn.style.opacity = '1';
        }, 60000);
        
        showAlert(`Verification code sent! Demo code: ${generatedVerificationCode}`, 'success');
    });
}

function validateVerificationCode() {
    const enteredCode = document.getElementById('verificationCode')?.value.trim();
    const storedCode = localStorage.getItem('verificationCode');
    const expiry = localStorage.getItem('verificationExpiry');
    
    if (!verificationCodeSent && !enteredCode) {
        showAlert('Please request a verification code first', 'error');
        return false;
    }
    if (!enteredCode) {
        showAlert('Please enter the verification code', 'error');
        return false;
    }
    if (!storedCode || !expiry) {
        showAlert('No verification code found. Please request a new code.', 'error');
        return false;
    }
    if (Date.now() > parseInt(expiry)) {
        showAlert('Verification code has expired. Please request a new code.', 'error');
        return false;
    }
    if (enteredCode !== storedCode) {
        showAlert('Invalid verification code. Please try again.', 'error');
        return false;
    }
    return true;
}

// ========== LOGIN FUNCTION ==========

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) {
        console.log('Login form not found');
        return;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            showAlert('Please fill in all fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            showAlert('Invalid email or password');
            return;
        }
        
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role
        }));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        
        showAlert('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            if (user.role === 'landlord') {
                window.location.href = 'landlord-dashboard.html';
            } else if (user.role === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else if (user.role === 'tenant') {
                window.location.href = 'tenant-dashboard.html';
            } else {
                window.location.href = 'listings.html';
            }
        }, 1500);
    });
}

// ========== REGISTER FUNCTION ==========

function initRegister() {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) {
        console.log('Register form not found');
        return;
    }
    
    console.log('Register form found');
    
    // Password strength meter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updateStrengthMeter(this.value);
        });
    }
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        // Get basic values
        const name = document.getElementById('fullname')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        const role = document.querySelector('input[name="role"]:checked');
        const agreeTerms = document.getElementById('agreeTerms')?.checked;
        
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Role:', role?.value);
        console.log('Terms:', agreeTerms);
        
        // Validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showAlert('Please fill in all required fields');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address');
            return;
        }
        
        if (phone.length < 11) {
            showAlert('Please enter a valid phone number (11 digits)');
            return;
        }
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match');
            return;
        }
        
        if (!role) {
            showAlert('Please select a role (Tenant or Landlord)');
            return;
        }
        
        if (!agreeTerms) {
            showAlert('Please agree to the Terms & Conditions');
            return;
        }
        
        // Verify code
        if (!validateVerificationCode()) {
            return;
        }
        
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.email === email)) {
            showAlert('Email already registered. Please login.');
            return;
        }
        
        // Generate User ID
        const prefix = role.value === 'landlord' ? 'LND' : 'TNT';
        const nameCode = name.substring(0, 3).toUpperCase();
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const userId = `${prefix}-${nameCode}-${randomNum}`;
        
        // Create new user
        const newUser = {
            id: Date.now(),
            userId: userId,
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: role.value,
            isVerified: true,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Save detailed user information
        let detailedUsers = JSON.parse(localStorage.getItem('detailedUsers')) || {};
        
        // Collect detailed info based on role
        let detailedInfo = {};
        
        if (role.value === 'tenant') {
            detailedInfo = {
                occupation: document.getElementById('occupation')?.value || '',
                companyName: document.getElementById('companyName')?.value || '',
                currentAddress: document.getElementById('currentAddress')?.value || '',
                emergencyContact: document.getElementById('emergencyContact')?.value || '',
                familyMembers: document.getElementById('familyMembers')?.value || '',
                preferredArea: document.getElementById('preferredArea')?.value || ''
            };
            console.log('Tenant details saved:', detailedInfo);
        } else if (role.value === 'landlord') {
            detailedInfo = {
                nidNumber: document.getElementById('nidNumber')?.value || '',
                tinNumber: document.getElementById('tinNumber')?.value || '',
                propertyCount: document.getElementById('propertyCount')?.value || '',
                businessAddress: document.getElementById('businessAddress')?.value || '',
                referenceName: document.getElementById('referenceName')?.value || '',
                referenceContact: document.getElementById('referenceContact')?.value || ''
            };
            console.log('Landlord details saved:', detailedInfo);
        }
        
        detailedUsers[newUser.id] = {
            ...newUser,
            ...detailedInfo
        };
        
        localStorage.setItem('detailedUsers', JSON.stringify(detailedUsers));
        
        // Clear verification data
        localStorage.removeItem('verificationCode');
        localStorage.removeItem('verificationExpiry');
        
        showAlert(`Registration successful!\n\nYour ${role.value === 'landlord' ? 'Landlord ID' : 'Tenant ID'}: ${userId}\n\nPlease login.`, 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    });
}

// ========== FORGOT PASSWORD FUNCTIONS ==========

function initForgotPassword() {
    const forgotForm = document.getElementById('forgotForm');
    if (!forgotForm) return;
    
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showAlert('Please enter your email address');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showAlert('No account found with this email address');
            return;
        }
        
        localStorage.setItem('resetEmail', email);
        const otp = Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('resetOTP', otp);
        console.log(`OTP for ${email}: ${otp}`);
        
        showAlert(`OTP sent to ${email}. Demo OTP: ${otp}`, 'success');
        
        setTimeout(() => {
            window.location.href = 'otp-verification.html';
        }, 2000);
    });
}

function initOTPVerification() {
    const otpForm = document.getElementById('otpForm');
    if (!otpForm) return;
    
    const otpInputs = document.querySelectorAll('.otp-input');
    if (otpInputs.length) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                if (this.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }
    
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let enteredOTP = '';
        otpInputs.forEach(input => {
            enteredOTP += input.value;
        });
        
        const storedOTP = localStorage.getItem('resetOTP');
        
        if (enteredOTP.length !== 6) {
            showAlert('Please enter the 6-digit OTP');
            return;
        }
        
        if (enteredOTP !== storedOTP) {
            showAlert('Invalid OTP. Please try again.');
            return;
        }
        
        showAlert('OTP verified successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'reset-password.html';
        }, 1500);
    });
    
    const resendLink = document.getElementById('resendOTP');
    if (resendLink) {
        let timer = 30;
        let canResend = false;
        
        const timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                resendLink.textContent = `Resend OTP (${timer}s)`;
                resendLink.classList.add('disabled');
            } else {
                clearInterval(timerInterval);
                resendLink.textContent = 'Resend OTP';
                resendLink.classList.remove('disabled');
                canResend = true;
            }
        }, 1000);
        
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!canResend) return;
            
            const email = localStorage.getItem('resetEmail');
            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('resetOTP', otp);
            console.log(`New OTP: ${otp}`);
            showAlert(`New OTP sent! Demo OTP: ${otp}`, 'success');
            canResend = false;
            timer = 30;
        });
    }
}

function initResetPassword() {
    const resetForm = document.getElementById('resetForm');
    if (!resetForm) return;
    
    const newPassword = document.getElementById('newPassword');
    if (newPassword) {
        newPassword.addEventListener('input', function() {
            updateStrengthMeter(this.value);
        });
    }
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match');
            return;
        }
        
        const email = localStorage.getItem('resetEmail');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex === -1) {
            showAlert('User not found');
            return;
        }
        
        users[userIndex].password = password;
        localStorage.setItem('users', JSON.stringify(users));
        
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetOTP');
        
        showAlert('Password reset successful! Please login.', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

// ========== CREATE DEFAULT ADMIN ==========

function createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(u => u.role === 'admin');
    
    if (!adminExists) {
        const adminUser = {
            id: Date.now(),
            userId: 'ADMIN-001',
            name: 'Admin User',
            email: 'admin@homiq.com',
            phone: '01700000000',
            password: 'admin123',
            role: 'admin',
            isVerified: true,
            createdAt: new Date().toISOString()
        };
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Default admin created: admin@homiq.com / admin123');
    }
}

// ========== MODAL SETUP ==========

function setupModals() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const closeTermsModal = document.getElementById('closeTermsModal');
    const closePrivacyModal = document.getElementById('closePrivacyModal');
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');
    const acceptPrivacyBtn = document.getElementById('acceptPrivacyBtn');
    
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
        });
    }
    
    if (closeTermsModal && termsModal) {
        closeTermsModal.addEventListener('click', () => termsModal.classList.remove('active'));
    }
    
    if (acceptTermsBtn && termsModal) {
        acceptTermsBtn.addEventListener('click', () => {
            termsModal.classList.remove('active');
            const agreeCheckbox = document.getElementById('agreeTerms');
            if (agreeCheckbox) agreeCheckbox.checked = true;
        });
    }
    
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
        });
    }
    
    if (closePrivacyModal && privacyModal) {
        closePrivacyModal.addEventListener('click', () => privacyModal.classList.remove('active'));
    }
    
    if (acceptPrivacyBtn && privacyModal) {
        acceptPrivacyBtn.addEventListener('click', () => privacyModal.classList.remove('active'));
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === termsModal) termsModal.classList.remove('active');
        if (e.target === privacyModal) privacyModal.classList.remove('active');
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (termsModal) termsModal.classList.remove('active');
            if (privacyModal) privacyModal.classList.remove('active');
        }
    });
}

// ========== INITIALIZE ==========

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    createDefaultAdmin();
    
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    
    switch(currentPage) {
        case 'login.html':
            initLogin();
            setupPasswordToggle();
            break;
        case 'register.html':
            initRegister();
            setupRoleToggle();
            setupPasswordToggle();
            setupVerificationCode();
            setupModals();
            break;
        case 'forgot-password.html':
            initForgotPassword();
            break;
        case 'otp-verification.html':
            initOTPVerification();
            break;
        case 'reset-password.html':
            initResetPassword();
            break;
        default:
            console.log('No auth page detected');
    }
});
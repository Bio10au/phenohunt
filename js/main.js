/* ================================================
   pHenohunt PROOF - Main JavaScript
   Interactive functionality and animations
================================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if components are being loaded
    if (document.getElementById('header-placeholder') || document.getElementById('footer-placeholder')) {
        // Wait for components to load before initializing
        document.addEventListener('componentsLoaded', function() {
            initializeApp();
        });
        
        // Fallback: initialize after a delay if components event doesn't fire
        setTimeout(() => {
            if (!document.querySelector('header') && !document.querySelector('footer')) {
                console.warn('Components may have failed to load, initializing anyway...');
                initializeApp();
            }
        }, 3000);
    } else {
        // No components to load, initialize immediately
        initializeApp();
    }
});

// Initialize all functionality
function initializeApp() {
    console.log('Initializing application...');
    initSmoothScrolling();
    initScrollAnimations();
    initFormValidation();
    initContactForm();
    initMobileMenu();
    initLoadingAnimations();
    console.log('Application initialized successfully');
}

/* ================================================
   Smooth Scrolling Navigation
================================================ */
function initSmoothScrolling() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ================================================
   Scroll Reveal Animations
================================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step, .benefits-text, .form-container, .hero-text, .hero-visual'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/* ================================================
   Page Loading Animations
================================================ */
function initLoadingAnimations() {
    // Add fade-in animation to hero section on page load
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('fade-in');
    }
    
    // Stagger animation for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in');
    });
}

/* ================================================
   Form Validation
================================================ */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
        
        form.addEventListener('submit', handleFormSubmit);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    const errorContainer = getOrCreateErrorContainer(field);
    
    // Clear previous errors
    errorContainer.textContent = '';
    field.classList.remove('error');
    
    // Validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'First name must be at least 2 characters and contain only letters'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Last name must be at least 2 characters and contain only letters'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\+]?[0-9\s\-\(\)]{8,}$/,
            message: 'Please enter a valid phone number'
        },
        subject: {
            required: true,
            minLength: 3,
            message: 'Subject must be at least 3 characters long'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Message must be at least 10 characters long'
        }
    };
    
    const rule = validationRules[fieldName];
    if (!rule) return;
    
    // Required field validation
    if (rule.required && !value) {
        showFieldError(field, errorContainer, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return true;
    
    // Minimum length validation
    if (rule.minLength && value.length < rule.minLength) {
        showFieldError(field, errorContainer, rule.message);
        return false;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
        showFieldError(field, errorContainer, rule.message);
        return false;
    }
    
    return true;
}

function clearErrors(e) {
    const field = e.target;
    const errorContainer = field.parentNode.querySelector('.error-message');
    
    if (errorContainer) {
        errorContainer.textContent = '';
        field.classList.remove('error');
    }
}

function showFieldError(field, errorContainer, message) {
    field.classList.add('error');
    errorContainer.textContent = message;
    errorContainer.style.color = '#dc2626';
    errorContainer.style.fontSize = '0.875rem';
    errorContainer.style.marginTop = '0.25rem';
}

function getOrCreateErrorContainer(field) {
    let errorContainer = field.parentNode.querySelector('.error-message');
    
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        field.parentNode.appendChild(errorContainer);
    }
    
    return errorContainer;
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        const fieldValid = validateField({ target: input });
        if (!fieldValid) isValid = false;
    });
    
    if (isValid) {
        submitForm(form);
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}

/* ================================================
   Contact Form Handling
================================================ */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Add loading state functionality
    const submitButton = contactForm.querySelector('.form-submit');
    if (!submitButton) return;
    
    const originalButtonText = submitButton.textContent;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showFormSuccess();
            contactForm.reset();
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    });
}

function submitForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Here you would typically send the data to your server
    console.log('Form submitted with data:', data);
    
    // For now, we'll just show a success message
    showFormSuccess();
}

function showFormSuccess() {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div style="
            background: linear-gradient(45deg, #b8e652, #7ba428);
            color: #2d5016;
            padding: 1rem 2rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(123, 164, 40, 0.3);
        ">
            ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
        </div>
    `;
    
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(successMessage, form);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/* ================================================
   Mobile Menu (enhanced to work with components)
================================================ */
function initMobileMenu() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuButton && navMenu) {
        // Remove any existing listeners to prevent duplicates
        mobileMenuButton.removeEventListener('click', handleMobileMenuClick);
        
        mobileMenuButton.addEventListener('click', handleMobileMenuClick);
        
        // Close menu when clicking on a link
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('mobile-active');
                mobileMenuButton.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuButton && navMenu && 
                !mobileMenuButton.contains(e.target) && 
                !navMenu.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
                mobileMenuButton.classList.remove('active');
            }
        });
    }
}

function handleMobileMenuClick(e) {
    e.preventDefault();
    const mobileMenuButton = e.target.closest('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuButton && navMenu) {
        navMenu.classList.toggle('mobile-active');
        mobileMenuButton.classList.toggle('active');
    }
}

/* ================================================
   Utility Functions
================================================ */

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add scroll-based header styling
window.addEventListener('scroll', throttle(() => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}, 100));

// Add CSS for scrolled header state
const scrolledHeaderCSS = `
.header.scrolled {
    background: rgba(45, 80, 22, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = scrolledHeaderCSS;
document.head.appendChild(style);
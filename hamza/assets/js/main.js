// Main application logic
class Portfolio {
    constructor() {
        this.isLoaded = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePageLoad();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

        // Navigation events
        this.setupNavigation();
        this.setupMobileMenu();
        
        // Form events
        this.setupContactForm();
        
        // Theme toggle
        this.setupThemeToggle();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    handlePageLoad() {
        if (this.isLoaded) return;
        
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        // Initialize scroll animations after load
        this.initializeScrollAnimations();
        
        // Preload critical images
        this.preloadImages();
        
        // Initialize performance monitoring
        this.monitorPerformance();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Update active nav link on scroll
        if (sections.length > 0) {
            this.setupScrollSpy(navLinks, sections);
        }
    }

    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;

        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupScrollSpy(navLinks, sections) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        // Add floating label effect
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on page load
            if (input.value.trim()) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
    }

    handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        const formData = new FormData(form);

        // Validate form
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        this.simulateFormSubmission(formData)
            .then(() => {
                this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
                
                // Remove focused classes
                form.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('focused', 'error', 'success');
                });
            })
            .catch(() => {
                this.showNotification('Failed to send message. Please try again later.', 'error');
            })
            .finally(() => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.parentElement;
            formGroup.classList.remove('error', 'success');

            if (!input.value.trim()) {
                formGroup.classList.add('error');
                isValid = false;
            } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
                formGroup.classList.add('error');
                isValid = false;
            } else {
                formGroup.classList.add('success');
            }
        });

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            // Simulate API delay
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject();
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const html = document.documentElement;
        const icon = themeToggle.querySelector('i');
        
        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        
        html.setAttribute('data-theme', currentTheme);
        this.updateThemeIcon(icon, currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
            
            // Add animation
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
                this.updateThemeIcon(icon, newTheme);
            }
        });
    }

    updateThemeIcon(icon, theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key - close modals/menus
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                if (window.closeProjectModal) {
                    window.closeProjectModal();
                }
            }

            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse interaction
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Update CSS custom property for scroll-based animations
        document.documentElement.style.setProperty('--scroll-y', scrollTop + 'px');
        
        // Navbar scroll effect
        this.updateNavbarOnScroll(scrollTop);
        
        // Back to top button
        this.updateBackToTopButton(scrollTop);
    }

    updateNavbarOnScroll(scrollTop) {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    updateBackToTopButton(scrollTop) {
        let backToTop = document.getElementById('backToTop');
        
        if (!backToTop) {
            backToTop = this.createBackToTopButton();
        }

        if (scrollTop > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    createBackToTopButton() {
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Back to top');
        
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow-medium)'
        });

        button.className = 'back-to-top hover-lift';
        
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.body.appendChild(button);
        return button;
    }

    handleResize() {
        // Update mobile menu state
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }

        // Recalculate animations if needed
        this.recalculateAnimations();
    }

    initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all elements with scroll-animate class
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    preloadImages() {
        const criticalImages = [
            'assets/images/profile.jpg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    monitorPerformance() {
        if (!('performance' in window)) return;

        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            // Log performance metrics
            console.log('Performance metrics:', {
                loadTime: loadTime + 'ms',
                domReady: (perfData.domContentLoadedEventEnd - perfData.navigationStart) + 'ms',
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime + 'ms'
            });

            // Warn about slow load times
            if (loadTime > 3000) {
                console.warn('Slow page load detected:', loadTime + 'ms');
            }
        });
    }

    recalculateAnimations() {
        // Recalculate particle positions or other dynamic elements
        // This would be called on resize if needed
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Cleanup method
    destroy() {
        // Clean up event listeners and observers
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations when page is hidden
        document.body.classList.add('page-hidden');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('page-hidden');
    }
});

// Add additional CSS for back-to-top button
const backToTopStyles = `
    .back-to-top.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .back-to-top:hover {
        transform: translateY(-4px) !important;
        box-shadow: var(--shadow-large) !important;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
    
    .page-hidden * {
        animation-play-state: paused !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = backToTopStyles;
document.head.appendChild(styleSheet);

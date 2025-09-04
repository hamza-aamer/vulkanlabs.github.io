// Complete JavaScript for Vulkan Labs Website with Mobile Optimization

class VulkanLabsWebsite {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        this.isTouch = 'ontouchstart' in window;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
        this.setupEventListeners();
        this.setupMobileOptimizations();
        
        // Only initialize heavy features on desktop
        if (!this.isMobile && !this.reducedMotion) {
            this.createParticles();
            this.setupCursor();
        }
        
        this.setupScrollAnimations();
        this.setupTypingEffect();
    }

    init() {
        // Initialize components
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        // Set up mobile viewport height fix
        this.setupViewportFix();
        
        // Loading screen
        this.createLoadingScreen();
        
        // Remove loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.querySelector('.loading');
                if (loading) {
                    loading.classList.add('hidden');
                    setTimeout(() => loading.remove(), 500);
                }
            }, this.isMobile ? 500 : 1000);
        });
    }

    setupViewportFix() {
        // Fix for mobile viewport height issues
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', this.debounce(setVH, 100));
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 500);
        });
    }

    setupMobileOptimizations() {
        if (!this.isMobile) return;

        // Disable hover effects on touch devices
        document.documentElement.classList.add('touch-device');
        
        // Optimize touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Handle virtual keyboard on mobile
        this.setupVirtualKeyboardHandling();
        
        // Optimize touch events
        this.setupTouchOptimizations();
        
        // Reduce animations on mobile
        if (this.reducedMotion || this.isMobile) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    setupVirtualKeyboardHandling() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.classList.add('keyboard-open');
                // Scroll input into view on mobile
                if (this.isMobile) {
                    setTimeout(() => {
                        input.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                }
            });
            
            input.addEventListener('blur', () => {
                document.body.classList.remove('keyboard-open');
            });
        });
    }

    setupTouchOptimizations() {
        // Add touch feedback for interactive elements
        const touchElements = document.querySelectorAll('.btn, .nav-link, .filter-btn, .project-link, .social-links a');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            });
        });
    }

    createLoadingScreen() {
        const loadingHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    setupEventListeners() {
        // Navigation toggle
        this.navToggle.addEventListener('click', () => this.toggleNavigation());
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.navMenu.classList.contains('active') && 
                !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.toggleNavigation();
            }
        });
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events with throttling for better performance
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
            this.updateActiveNavLink();
        }, 16)); // ~60fps

        // Button scroll events
        document.querySelectorAll('[data-scroll-to]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-scroll-to');
                this.scrollToSection(target);
            });
        });

        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Project filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProjects(e));
        });

        // Service card tilt effect (desktop only)
        if (!this.isMobile && !this.isTouch) {
            this.setupTiltEffect();
        }

        // Resize handler with debouncing
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Form field handlers for better UX
        this.setupFormFieldHandlers();
        
        // Intersection Observer for performance
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        // Only load heavy animations when elements are visible
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load animations for visible elements
                    this.loadElementAnimations(entry.target);
                }
            });
        }, observerOptions);

        // Observe sections for lazy loading animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    loadElementAnimations(element) {
        // Only load heavy animations when needed
        if (element.id === 'services' && !this.isMobile) {
            this.createServicesEffects();
        }
    }

    createServicesEffects() {
        // Create floating particles for services section (desktop only)
        if (this.isMobile || this.reducedMotion) return;

        const servicesSection = document.querySelector('.services');
        if (!servicesSection || servicesSection.dataset.animated) return;

        servicesSection.dataset.animated = 'true';
        
        // Add energy particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            const container = servicesSection.querySelector('.services-energy-particles');
            if (container) {
                container.appendChild(particle);
            }
        }
    }

    setupFormFieldHandlers() {
        const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        
        formFields.forEach(field => {
            // Set initial state
            this.updateFieldLabel(field);
            
            // Listen for changes
            field.addEventListener('input', () => this.updateFieldLabel(field));
            field.addEventListener('change', () => this.updateFieldLabel(field));
            field.addEventListener('focus', () => this.updateFieldLabel(field));
            field.addEventListener('blur', () => this.updateFieldLabel(field));
            
            // Special handling for select elements
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', () => {
                    const label = field.nextElementSibling;
                    if (label && label.tagName === 'LABEL') {
                        if (field.value && field.value !== '') {
                            field.classList.add('has-value');
                            label.classList.add('active');
                        } else {
                            field.classList.remove('has-value');
                            if (!field.matches(':focus')) {
                                label.classList.remove('active');
                            }
                        }
                    }
                });
            }
        });
        
        // Set up the _replyto field to match the email input
        const emailInput = document.querySelector('#email');
        const replytoInput = document.querySelector('#replyto');
        
        if (emailInput && replytoInput) {
            emailInput.addEventListener('input', () => {
                replytoInput.value = emailInput.value;
            });
        }
    }

    updateFieldLabel(field) {
        const label = field.nextElementSibling;
        if (!label || !label.matches('label')) return;
    
        let hasValue = false;
        const isFocused = document.activeElement === field;
        
        // Properly check if field has a value
        if (field.tagName === 'SELECT') {
            // For select elements, check if a non-empty option is selected
            hasValue = field.value && field.value.trim() !== '';
            
            // Add or remove has-value class for CSS targeting
            if (hasValue) {
                field.classList.add('has-value');
            } else {
                field.classList.remove('has-value');
            }
        } else {
            // For input and textarea elements
            hasValue = field.value.trim() !== '';
        }
        
        // Update label state
        if (hasValue || isFocused) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    }

    toggleNavigation() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevent body scroll when mobile menu is open
        if (this.isMobile) {
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        
        // Close mobile menu
        if (this.isMobile) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const navbarHeight = this.isMobile ? 60 : 70;
            const offsetTop = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar background
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Parallax effects (desktop only)
        if (!this.isMobile && !this.reducedMotion) {
            this.updateParallax(scrollY);
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navbarHeight = this.isMobile ? 60 : 70;
        const scrollPosition = window.scrollY + navbarHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    updateParallax(scrollY) {
        // Only apply parallax on larger screens for better performance
        if (this.isMobile) return;

        // Hero background parallax
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
        }

        // Floating elements parallax
        const floatingElements = document.querySelectorAll('.float-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer || this.isMobile || this.reducedMotion) return;

        const particleCount = 30; // Reduced for better performance
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add particle animation CSS if not exists
        if (!document.querySelector('#particle-keyframes')) {
            const particleStyles = `
                @keyframes particleFloat {
                    0% {
                        transform: translateY(100vh) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'particle-keyframes';
            styleSheet.textContent = particleStyles;
            document.head.appendChild(styleSheet);
        }
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animate stats counter
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        document.querySelectorAll('.service-card, .project-card, .stat-item').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Observe stat numbers
        document.querySelectorAll('.stat-number').forEach(el => {
            observer.observe(el);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count')) || parseInt(element.textContent);
        const duration = this.isMobile ? 1000 : 2000; // Faster on mobile
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    setupCursor() {
        // Skip custom cursor on mobile devices and touch devices
        if (this.isMobile || this.isTouch) return;

        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        if (!cursorDot || !cursorOutline) return;

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth follow for outline
        const animateOutline = () => {
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            if (!this.isMobile) {
                requestAnimationFrame(animateOutline);
            }
        };
        animateOutline();

        // Cursor interactions
        document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'scale(2)';
                cursorOutline.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'scale(1)';
                cursorOutline.style.transform = 'scale(1)';
            });
        });
    }

    setupTypingEffect() {
        const codeContent = document.getElementById('code-content');
        if (!codeContent) return;

        const codeLines = codeContent.querySelectorAll('.code-line');
        
        // Stagger the animation of code lines
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.animation = 'none';
            }, index * (this.isMobile ? 50 : 100) + 1000);
        });
    }

    setupTiltEffect() {
        // Skip tilt effect on mobile and touch devices
        if (this.isMobile || this.isTouch) return;

        const tiltElements = document.querySelectorAll('.service-card, .project-card');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -5; // Reduced intensity
                const rotateY = (x - centerX) / centerX * 5;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            });
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Get form data
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !service || !message) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Set reply-to field
        const replytoInput = document.getElementById('replyto');
        if (replytoInput) {
            replytoInput.value = email;
        }
        
        // Animate submit button
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        try {
            // Submit to Formspree endpoint
            const response = await fetch('https://formspree.io/f/xgvywwba', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
                
                // Reset all form labels
                document.querySelectorAll('.form-group label').forEach(label => {
                    label.classList.remove('active');
                });
                document.querySelectorAll('.form-group select').forEach(select => {
                    select.classList.remove('has-value');
                });
            } else {
                const data = await response.json();
                if (data.errors) {
                    this.showNotification('Please correct the errors and try again', 'error');
                } else {
                    throw new Error('Failed to send message');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again or email us directly at hello@vulkanlabs.com', 'error');
        } finally {
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: ${this.isMobile ? '10px' : '20px'};
            right: ${this.isMobile ? '10px' : '20px'};
            left: ${this.isMobile ? '10px' : 'auto'};
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: ${this.isMobile ? '8px' : '12px'};
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            max-width: ${this.isMobile ? 'none' : '320px'};
            font-size: ${this.isMobile ? '0.9rem' : '0.875rem'};
            line-height: 1.4;
            word-wrap: break-word;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateY(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, type === 'error' ? 6000 : 4000);
    }

    filterProjects(e) {
        const filterValue = e.target.getAttribute('data-filter');
        const projectCards = document.querySelectorAll('.project-card');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter projects with animation
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    handleResize() {
        // Update mobile/tablet detection
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        
        // Handle responsive behaviors
        if (this.isMobile) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
            
            // Disable heavy effects on mobile
            if (!wasMobile) {
                this.disableDesktopEffects();
            }
        } else {
            // Re-enable desktop effects if switching from mobile
            if (wasMobile) {
                this.enableDesktopEffects();
            }
        }
        
        // Update viewport height
        this.setupViewportFix();
    }

    disableDesktopEffects() {
        // Remove particles
        document.querySelectorAll('.particle').forEach(p => p.remove());
        
        // Disable cursor
        const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline');
        cursorElements.forEach(el => el.style.display = 'none');
        
        // Add mobile class for CSS optimizations
        document.documentElement.classList.add('mobile-optimized');
    }

    enableDesktopEffects() {
        // Re-enable cursor
        const cursorElements = document.querySelectorAll('.cursor-dot, .cursor-outline');
        cursorElements.forEach(el => el.style.display = '');
        
        // Re-create particles
        this.createParticles();
        this.setupCursor();
        
        // Remove mobile class
        document.documentElement.classList.remove('mobile-optimized');
    }

    // Utility functions
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Performance monitoring for development
    initPerformanceMonitor() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            let fps = 0;
            let lastTime = performance.now();
            
            const monitor = document.createElement('div');
            monitor.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 5px 10px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10000;
                border-radius: 4px;
            `;
            document.body.appendChild(monitor);
            
            const updateFPS = (currentTime) => {
                fps = Math.round(1000 / (currentTime - lastTime));
                lastTime = currentTime;
                monitor.textContent = `FPS: ${fps} | Mobile: ${this.isMobile}`;
                requestAnimationFrame(updateFPS);
            };
            
            requestAnimationFrame(updateFPS);
        }
    }
}

// Advanced Dynamic Scroll Animations Class (Desktop Only)
class VulkanScrollAnimations {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.isMobile || this.reducedMotion) {
            return; // Skip heavy animations on mobile
        }
        
        this.init();
        this.setupScrollObserver();
        this.createDynamicBackground();
        this.setupMouseEffects();
        this.createDataVisualization();
    }

    init() {
        // Initialize animation system (desktop only)
        this.scrollProgress = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];
        this.networkNodes = [];
        
        // Create dynamic background elements
        this.createMorphingShapes();
        this.createNetworkGrid();
        this.createFloatingCode();
        
        // Setup scroll listener with throttling
        this.setupScrollListener();
    }

    createMorphingShapes() {
        const morphBg = document.createElement('div');
        morphBg.className = 'vulkan-morph-bg';
        
        for (let i = 1; i <= 3; i++) {
            const blob = document.createElement('div');
            blob.className = `morph-blob morph-blob-${i}`;
            morphBg.appendChild(blob);
        }
        
        document.body.appendChild(morphBg);
        this.morphBlobs = morphBg.querySelectorAll('.morph-blob');
    }

    createNetworkGrid() {
        const networkContainer = document.createElement('div');
        networkContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        // Create network lines (reduced number for performance)
        for (let i = 0; i < 10; i++) {
            const line = document.createElement('div');
            line.className = 'network-line';
            line.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 150 + 75}px;
                transform: rotate(${Math.random() * 180}deg);
                animation-delay: ${Math.random() * 4}s;
            `;
            networkContainer.appendChild(line);
        }
        
        document.body.appendChild(networkContainer);
    }

    createFloatingCode() {
        const codeSnippets = [
            'agent.execute()', 'import vulkan_ai', 'class AgentPipeline:',
            'async def process()', 'torch.compile()', 'agent.memory.scoped',
            'from agents import *', 'gpu.accelerate()', 'ml.inference()',
            'pipeline.resilient', 'fallback.enabled', 'def neural_net():'
        ];
        
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        // Create floating code particles (reduced frequency)
        setInterval(() => {
            if (container.children.length < 8) {
                const particle = document.createElement('div');
                particle.className = 'code-particle';
                particle.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                particle.style.cssText = `
                    left: ${Math.random() * 100}%;
                    animation-duration: ${Math.random() * 8 + 12}s;
                    animation-delay: ${Math.random() * 3}s;
                `;
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 15000);
            }
        }, 3000);
        
        document.body.appendChild(container);
    }

    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Add scroll progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        this.progressBar = progressBar.querySelector('.scroll-progress-bar');
    }

    updateScrollEffects() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = scrollTop / docHeight;
        
        // Update progress bar
        this.progressBar.style.width = `${this.scrollProgress * 100}%`;
        
        // Update morphing shapes
        this.morphBlobs.forEach((blob, index) => {
            const rotation = this.scrollProgress * 360 * (index + 1);
            const scale = 1 + Math.sin(this.scrollProgress * Math.PI * 4) * 0.1;
            const translateY = Math.sin(this.scrollProgress * Math.PI * 2) * 30;
            const translateX = Math.cos(this.scrollProgress * Math.PI * 2) * 20;
            
            blob.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;
        });
    }

    setupScrollObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe existing elements
        document.querySelectorAll('.service-card, .project-card, .stat-item').forEach(el => {
            observer.observe(el);
        });
        
        // Add dynamic terminals
        this.addDynamicTerminals();
        this.addDataVisualization();
    }

    addDynamicTerminals() {
        const aboutSection = document.querySelector('.about');
        if (aboutSection && !aboutSection.querySelector('.dynamic-terminal')) {
            // Create main terminal
            const terminal = document.createElement('div');
            terminal.className = 'dynamic-terminal';
            terminal.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 12px; height: 12px; background: #ff5f57; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #28ca42; border-radius: 50%;"></div>
                    <span style="color: #fff; font-size: 0.875rem; margin-left: 1rem;">vulkan_systems.py</span>
                </div>
                <div class="terminal-line">$ ./start_ai_cluster.sh</div>
                <div class="terminal-line">Initializing Vulkan API... ✓</div>
                <div class="terminal-line">Loading agentic pipelines... ████████████ 100%</div>
                <div class="terminal-line">Neural acceleration: ENABLED</div>
                <div class="terminal-line">Resilient agents: ACTIVE</div>
                <div class="terminal-line">Performance: 15.7 TFLOPS <span class="typing-cursor">█</span></div>
            `;
            
            aboutSection.appendChild(terminal);
            
            // Animate terminal when visible
            const terminalObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateTerminal(entry.target);
                    }
                });
            });
            
            terminalObserver.observe(terminal);
        }
    }

    animateTerminal(terminal) {
        const lines = terminal.querySelectorAll('.terminal-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('active');
                
                // Add typing effect for the last line with cursor
                if (index === lines.length - 1 && line.querySelector('.typing-cursor')) {
                    const cursor = line.querySelector('.typing-cursor');
                    cursor.style.animation = 'blink 1s infinite';
                }
            }, index * 400);
        });
    }

    addDataVisualization() {
        const servicesSection = document.querySelector('.services');
        if (servicesSection && !servicesSection.querySelector('.data-viz')) {
            const dataViz = document.createElement('div');
            dataViz.className = 'data-viz';
            dataViz.innerHTML = `
                <h3 style="color: #fff; margin-bottom: 1.5rem;">AI System Performance Metrics</h3>
                <div style="margin-bottom: 1rem;">
                    <span style="color: #a1a1aa;">Agent Reliability</span>
                    <div class="viz-bar">
                        <div class="viz-bar-fill" data-width="99"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <span style="color: #a1a1aa;">GPU Utilization</span>
                    <div class="viz-bar">
                        <div class="viz-bar-fill" data-width="94"></div>
                    </div>
                </div>
                <div style="margin-bottom: 1rem;">
                    <span style="color: #a1a1aa;">Neural Processing Speed</span>
                    <div class="viz-bar">
                        <div class="viz-bar-fill" data-width="96"></div>
                    </div>
                </div>
                <div>
                    <span style="color: #a1a1aa;">System Uptime</span>
                    <div class="viz-bar">
                        <div class="viz-bar-fill" data-width="100"></div>
                    </div>
                </div>
            `;
            
            servicesSection.appendChild(dataViz);
            
            // Animate data visualization when visible
            const vizObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateDataViz(entry.target);
                    }
                });
            });
            
            vizObserver.observe(dataViz);
        }
    }

    animateDataViz(viz) {
        const bars = viz.querySelectorAll('.viz-bar-fill');
        const title = viz.querySelector('h3');
        
        // Animate title first
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
                title.style.transition = 'all 0.6s ease';
            }, 200);
        }
        
        // Animate bars with stagger effect
        bars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            const label = bar.parentElement.previousElementSibling;
            
            setTimeout(() => {
                // Animate label first
                if (label) {
                    label.style.color = '#fff';
                    label.style.transition = 'color 0.3s ease';
                }
                
                // Then animate bar
                setTimeout(() => {
                    bar.style.width = `${width}%`;
                    
                    // Add completion glow effect
                    setTimeout(() => {
                        bar.style.boxShadow = `0 0 20px rgba(99, 102, 241, 0.6)`;
                    }, 1000);
                }, 100);
            }, index * 300);
        });
    }

    setupMouseEffects() {
        // Only on desktop
        if (window.innerWidth <= 768) return;

        let trailDots = [];
        const maxTrailLength = 15;
        
        document.addEventListener('mousemove', (e) => {
            // Create trail dot with reduced frequency
            if (Math.random() > 0.7) {
                const dot = document.createElement('div');
                dot.className = 'trail-dot';
                dot.style.left = `${e.clientX}px`;
                dot.style.top = `${e.clientY}px`;
                
                document.body.appendChild(dot);
                trailDots.push(dot);
                
                if (trailDots.length > maxTrailLength) {
                    const oldDot = trailDots.shift();
                    if (oldDot.parentNode) {
                        oldDot.remove();
                    }
                }
                
                setTimeout(() => {
                    if (dot.parentNode) {
                        dot.remove();
                    }
                }, 800);
            }
        });
    }

    createDynamicBackground() {
        // Add dynamic particles that respond to scroll (reduced frequency)
        setInterval(() => {
            if (Math.random() > 0.8 && window.innerWidth > 768) {
                this.createScrollParticle();
            }
        }, 2000);
    }

    createScrollParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: particleRise 6s linear forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 6000);
    }

    animateElement(element) {
        // Enhanced animation for different element types
        if (element.classList.contains('service-card')) {
            element.style.transform = 'translateY(0) rotateX(0) scale(1)';
            element.style.opacity = '1';
        }
        
        if (element.classList.contains('project-card')) {
            element.style.transform = 'translateY(0) rotateY(0) scale(1)';
            element.style.opacity = '1';
        }
        
        if (element.classList.contains('stat-item')) {
            element.style.transform = 'translateY(0) scale(1)';
            element.style.opacity = '1';
            
            // Animate the stat number
            const statNumber = element.querySelector('.stat-number');
            if (statNumber) {
                this.animateCounter(statNumber);
            }
        }
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count')) || parseInt(element.textContent);
        const duration = 1500;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new VulkanLabsWebsite();
    
    // Initialize advanced features after a short delay (desktop only)
    setTimeout(() => {
        if (!website.isMobile && !website.reducedMotion) {
            website.initPerformanceMonitor();
            
            // Initialize dynamic scroll animations
            window.vulkanScrollAnimations = new VulkanScrollAnimations();
        }
    }, 1500);
});

// Add some extra utility functions
window.VulkanLabs = {
    // Smooth scroll utility
    smoothScroll: (target, duration = 1000) => {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;
        
        const isMobile = window.innerWidth <= 768;
        const navbarHeight = isMobile ? 60 : 70;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    },
    
    // Debounce utility
    debounce: (func, wait, immediate) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle utility
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Mobile-specific optimizations
if (window.innerWidth <= 768) {
    // Disable hover effects on touch devices
    const style = document.createElement('style');
    style.textContent = `
        .service-card:hover,
        .project-card:hover,
        .btn:hover,
        .filter-btn:hover {
            transform: none !important;
        }
        
        .service-card::after,
        .holographic-card::before {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add touch-friendly spacing
    document.documentElement.style.setProperty('--touch-target-size', '44px');
}
// Advanced JavaScript for Vulkan Labs Website

class VulkanLabsWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createParticles();
        this.setupScrollAnimations();
        this.setupCursor();
        this.setupTypingEffect();
    }

    init() {
        // Initialize components
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
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
            }, 1000);
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
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.updateActiveNavLink();
        });

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

        // Service card tilt effect
        this.setupTiltEffect();

        // Resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Form field handlers for better UX
        this.setupFormFieldHandlers();
    }

    setupFormFieldHandlers() {
        // Handle form field focus/blur for better label animation
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

        const hasValue = field.value.trim() !== '';
        const isFocused = document.activeElement === field;
        
        if (hasValue || isFocused) {
            label.classList.add('active');
            if (field.tagName === 'SELECT' && hasValue) {
                field.classList.add('has-value');
            }
        } else {
            label.classList.remove('active');
            if (field.tagName === 'SELECT') {
                field.classList.remove('has-value');
            }
        }
    }

    toggleNavigation() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        
        // Close mobile menu
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            // Calculate offset based on screen size
            const isMobile = window.innerWidth <= 768;
            const navbarHeight = isMobile ? 60 : 70;
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

        // Parallax effects
        this.updateParallax(scrollY);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const isMobile = window.innerWidth <= 768;
        const navbarHeight = isMobile ? 60 : 70;
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
        if (window.innerWidth > 768) {
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
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer || window.innerWidth <= 768) return; // Skip on mobile for performance

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add particle animation CSS
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
        styleSheet.textContent = particleStyles;
        document.head.appendChild(styleSheet);
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
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
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
        // Skip custom cursor on mobile devices
        if (window.innerWidth <= 768 || 'ontouchstart' in window) return;

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
            
            requestAnimationFrame(animateOutline);
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
            }, index * 100 + 1000);
        });
    }

    setupTiltEffect() {
        // Skip tilt effect on mobile for better performance
        if (window.innerWidth <= 768) return;

        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
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
            // Submit to your Formspree endpoint
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
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 320px;
            font-size: 0.875rem;
            line-height: 1.4;
            word-wrap: break-word;
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
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
        // Handle responsive behaviors
        if (window.innerWidth > 768) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
        }
        
        // Re-initialize cursor on resize
        if (window.innerWidth > 768 && !('ontouchstart' in window)) {
            this.setupCursor();
        }
    }

    // Advanced animation utilities
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    animateValue(obj, start, end, duration, callback) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = this.easeInOutCubic(progress);
            const value = start + (end - start) * easedProgress;
            
            if (callback) callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    // Matrix rain effect for hero background
    createMatrixRain() {
        // Skip on mobile for performance
        if (window.innerWidth <= 768) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.1;
            z-index: -1;
        `;
        
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.appendChild(canvas);
        }
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const chars = '01アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#6366f1';
            ctx.font = `${fontSize}px monospace`;
            
            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 50);
    }

    // Initialize advanced features
    initAdvancedFeatures() {
        // Matrix rain effect
        if (window.innerWidth > 768) {
            this.createMatrixRain();
        }
        
        // Add floating action button
        this.createFloatingActionButton();
        
        // Initialize performance monitor
        this.initPerformanceMonitor();
    }

    createFloatingActionButton() {
        const fab = document.createElement('div');
        fab.innerHTML = '<i class="fas fa-rocket"></i>';
        fab.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            opacity: 0;
            transform: scale(0);
        `;
        
        fab.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'scale(1.1)';
            fab.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';
        });
        
        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'scale(1)';
            fab.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)';
        });
        
        document.body.appendChild(fab);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                fab.style.opacity = '1';
                fab.style.transform = 'scale(1)';
            } else {
                fab.style.opacity = '0';
                fab.style.transform = 'scale(0)';
            }
        });
    }

    initPerformanceMonitor() {
        // Simple FPS counter for development
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
                monitor.textContent = `FPS: ${fps}`;
                requestAnimationFrame(updateFPS);
            };
            
            requestAnimationFrame(updateFPS);
        }
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new VulkanLabsWebsite();
    
    // Initialize advanced features after a short delay
    setTimeout(() => {
        website.initAdvancedFeatures();
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
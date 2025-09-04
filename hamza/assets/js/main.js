// Main application class with custom project animations
class Portfolio {
    constructor() {
        this.isLoaded = false;
        this.scrollObserver = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateBarcode();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupContactForm();
        this.handlePageLoad();
        this.setupProjectAnimations();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        
        // Navigation
        this.setupNavigation();
        
        // Theme and interactions
        this.setupInteractions();
    }

    handlePageLoad() {
        if (this.isLoaded) return;
        
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        // Initialize animations after load
        this.triggerLoadAnimations();
    }

    triggerLoadAnimations() {
        // Animate floating elements with delays
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.classList.add('animate-float');
            }, 1000 + (index * 200));
        });

        // Animate badges with stagger
        const badges = document.querySelectorAll('.badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.classList.add('animate-fadeInUp');
            }, 1200 + (index * 150));
        });
    }

    generateBarcode() {
        const barcodeContainer = document.getElementById('barcode');
        if (!barcodeContainer) return;

        const name = 'HAMZAAAMER';
        const barcodePattern = this.textToBarcode(name);
        
        barcodeContainer.innerHTML = '';
        
        barcodePattern.forEach((width, index) => {
            const line = document.createElement('div');
            line.className = 'barcode-line';
            line.style.cssText = `
                width: ${width}px;
                height: ${Math.random() * 20 + 20}px;
                background: var(--text-primary);
                animation-delay: ${index * 0.05}s;
            `;
            barcodeContainer.appendChild(line);
        });
    }

    textToBarcode(text) {
        // Simple barcode pattern generator
        const patterns = {
            'A': [3, 1, 3, 1, 2], 'B': [1, 3, 3, 1, 2], 'C': [3, 3, 1, 1, 2],
            'D': [1, 1, 3, 3, 2], 'E': [3, 1, 1, 3, 2], 'F': [1, 3, 1, 3, 2],
            'G': [1, 1, 1, 5, 2], 'H': [3, 1, 1, 1, 4], 'I': [1, 3, 1, 1, 4],
            'J': [1, 1, 3, 1, 4], 'K': [3, 1, 1, 1, 2], 'L': [1, 3, 1, 1, 2],
            'M': [1, 1, 3, 1, 2], 'N': [3, 1, 1, 3, 1], 'O': [1, 3, 1, 3, 1],
            'P': [1, 1, 3, 3, 1], 'Q': [3, 1, 3, 1, 1], 'R': [1, 3, 3, 1, 1],
            'S': [1, 1, 1, 3, 3], 'T': [3, 1, 1, 1, 3], 'U': [1, 3, 1, 1, 3],
            'V': [1, 1, 3, 1, 3], 'W': [3, 1, 1, 1, 1], 'X': [1, 3, 1, 1, 1],
            'Y': [1, 1, 3, 1, 1], 'Z': [1, 1, 1, 3, 1]
        };

        let barcode = [];
        for (let char of text) {
            if (patterns[char]) {
                barcode = barcode.concat(patterns[char]);
            }
        }
        
        return barcode.map(width => Math.max(2, width * 2));
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Handle project showcase specific animations
                    if (entry.target.classList.contains('project-showcase')) {
                        this.animateProjectShowcase(entry.target);
                    }
                    
                    // Handle staggered animations
                    const children = entry.target.querySelectorAll('.stagger-animate');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(`
            .scroll-animate, 
            .scroll-animate-left, 
            .scroll-animate-right, 
            .scroll-animate-scale,
            .edu-card,
            .timeline-item,
            .skill-tag,
            .project-showcase
        `);

        animateElements.forEach(el => {
            if (this.scrollObserver) {
                this.scrollObserver.observe(el);
            }
        });
    }

    animateProjectShowcase(projectElement) {
        // Animate progress bars
        const progressBars = projectElement.querySelectorAll('.perf-fill, .progress-fill');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            if (targetWidth) {
                setTimeout(() => {
                    bar.style.setProperty('--width', `${targetWidth}%`);
                    bar.style.width = `${targetWidth}%`;
                }, 500);
            }
        });

        // Animate detection points
        const detectionPoints = projectElement.querySelectorAll('.detection-points .point');
        detectionPoints.forEach((point, index) => {
            setTimeout(() => {
                point.classList.add('active');
            }, 800 + (index * 200));
        });

        // Animate flow steps
        const flowSteps = projectElement.querySelectorAll('.flow-step');
        flowSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.transform = 'translateY(-4px)';
                step.style.boxShadow = 'var(--shadow-medium)';
                setTimeout(() => {
                    step.style.transform = 'translateY(0)';
                    step.style.boxShadow = 'var(--shadow-soft)';
                }, 300);
            }, 600 + (index * 200));
        });

        // Animate agents in Ant-AI
        const agents = projectElement.querySelectorAll('.agent');
        agents.forEach((agent, index) => {
            setTimeout(() => {
                agent.style.animation = `float 6s ease-in-out infinite ${index * 0.5}s`;
            }, 1000 + (index * 150));
        });

        // Animate pipeline steps
        const pipelineSteps = projectElement.querySelectorAll('.pipeline-step');
        pipelineSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.transform = 'translateY(-2px) scale(1.02)';
                setTimeout(() => {
                    step.style.transform = 'translateY(0) scale(1)';
                }, 200);
            }, 1200 + (index * 150));
        });
    }

    setupProjectAnimations() {
        // Add hover effects to interactive elements
        document.querySelectorAll('.flow-step').forEach(step => {
            step.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.05)';
                this.style.boxShadow = 'var(--shadow-strong)';
            });
            
            step.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'var(--shadow-soft)';
            });
        });

        // Add click effects to agents
        document.querySelectorAll('.agent').forEach(agent => {
            agent.addEventListener('click', function() {
                this.style.animation = 'none';
                this.style.transform = 'scale(1.2)';
                this.style.boxShadow = '0 8px 25px rgba(139, 115, 85, 0.3)';
                
                setTimeout(() => {
                    this.style.animation = 'float 6s ease-in-out infinite';
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'var(--shadow-soft)';
                }, 300);
            });
        });

        // Add hover effects to roof sections
        document.querySelectorAll('.roof-section').forEach(section => {
            section.addEventListener('mouseenter', function() {
                this.style.boxShadow = `0 0 15px ${this.style.backgroundColor}`;
                this.style.transform = 'scale(1.1)';
            });
            
            section.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
                this.style.transform = 'scale(1)';
            });
        });

        // Add tooltips to interactive elements
        this.setupTooltips();
    }

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--text-primary);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    pointer-events: none;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    white-space: nowrap;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                element._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', () => {
                if (element._tooltip) {
                    element._tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (element._tooltip && element._tooltip.parentNode) {
                            element._tooltip.parentNode.removeChild(element._tooltip);
                        }
                        element._tooltip = null;
                    }, 300);
                }
            });
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        // Active section highlighting
        if (sections.length > 0) {
            this.setupScrollSpy(navLinks, sections);
        }
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

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        // Floating label effects
        inputs.forEach(input => {
            // Check initial state
            if (input.value.trim()) {
                input.parentElement.classList.add('focused');
            }

            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value.trim()) {
                    input.parentElement.classList.remove('focused');
                }
            });

            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    validateField(field) {
        const isValid = field.checkValidity() && field.value.trim();
        const formGroup = field.parentElement;

        formGroup.classList.remove('error', 'success');
        
        if (field.value.trim()) {
            if (isValid) {
                formGroup.classList.add('success');
            } else {
                formGroup.classList.add('error');
                // Add shake animation
                field.classList.add('animate-wiggle');
                setTimeout(() => field.classList.remove('animate-wiggle'), 800);
            }
        }
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input) || !input.value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Remove all focused states
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused', 'error', 'success');
            });

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Success animation
            submitBtn.classList.add('animate-pulse');
            setTimeout(() => submitBtn.classList.remove('animate-pulse'), 600);
        }, 2000);
    }

    setupInteractions() {
        // Add click effects to interactive elements
        document.querySelectorAll('.badge, .skill-tag, .social-link, .tech-pill').forEach(element => {
            element.addEventListener('click', function() {
                this.classList.add('animate-pulse');
                setTimeout(() => this.classList.remove('animate-pulse'), 600);
            });
        });

        // Add hover effects to floating elements
        document.querySelectorAll('.float-element').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.animationPlayState = 'paused';
                this.classList.add('animate-wiggle');
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.animationPlayState = 'running';
                setTimeout(() => this.classList.remove('animate-wiggle'), 800);
            });
        });

        // Interactive project metrics
        document.querySelectorAll('.metric-item').forEach(metric => {
            metric.addEventListener('mouseenter', function() {
                const number = this.querySelector('.metric-number');
                if (number) {
                    number.style.transform = 'scale(1.2)';
                    number.style.color = 'var(--accent-dark)';
                }
            });
            
            metric.addEventListener('mouseleave', function() {
                const number = this.querySelector('.metric-number');
                if (number) {
                    number.style.transform = 'scale(1)';
                    number.style.color = 'var(--accent)';
                }
            });
        });

        // Add some delightful micro-interactions
        this.setupMicroInteractions();
    }

    setupMicroInteractions() {
        // Click effect for the brand logo
        const brandLink = document.querySelector('.brand-link');
        if (brandLink) {
            brandLink.addEventListener('click', function(e) {
                e.preventDefault();
                this.style.animation = 'wiggle 0.8s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 400);
            });
        }

        // Barcode hover effect
        const barcode = document.getElementById('barcode');
        if (barcode) {
            barcode.addEventListener('mouseenter', function() {
                const lines = this.querySelectorAll('.barcode-line');
                lines.forEach((line, index) => {
                    setTimeout(() => {
                        line.style.animation = 'pulse 0.3s ease-in-out';
                        setTimeout(() => line.style.animation = '', 300);
                    }, index * 50);
                });
            });
        }

        // Profile image interaction
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            let clickCount = 0;
            profileImg.addEventListener('click', function() {
                clickCount++;
                if (clickCount === 5) {
                    // Easter egg after 5 clicks
                    this.style.animation = 'heartbeat 1s ease-in-out 3';
                    setTimeout(() => {
                        this.style.animation = '';
                        if (window.portfolio) {
                            window.portfolio.showNotification('🎉 You found the secret! Thanks for exploring!', 'success');
                        }
                    }, 3000);
                    clickCount = 0;
                }
            });
        }
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrollTop * 0.1}px)`;
        }
        
        // Update navbar appearance
        const nav = document.querySelector('.nav');
        if (nav) {
            if (scrollTop > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        // Update floating elements based on scroll
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const scrollFactor = (window.innerHeight - rect.top) / window.innerHeight;
                const translateY = Math.sin(scrollTop * 0.01 + index) * 10;
                element.style.transform = `translateY(${translateY}px)`;
            }
        });
    }

    handleResize() {
        // Recalculate animations and layouts if needed
        if (window.innerWidth < 768) {
            this.handleMobileLayout();
        } else {
            this.handleDesktopLayout();
        }
    }

    handleMobileLayout() {
        // Mobile-specific adjustments
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach(element => {
            element.style.display = 'none';
        });
    }

    handleDesktopLayout() {
        // Desktop-specific adjustments
        const floatElements = document.querySelectorAll('.float-element');
        floatElements.forEach(element => {
            element.style.display = 'block';
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icons[type] || icons.info}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444', 
            info: '#3b82f6',
            warning: '#f59e0b'
        };

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            background: colors[type] || colors.info,
            color: 'white',
            padding: '16px 20px',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-medium)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
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
            const context = this;
            const args = arguments;
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
        if (this.scrollObserver) {
            this.scrollObserver.disconnect();
        }
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
    }
    }

    // Initialize the application
    document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
    });

    // Add some delightful easter eggs
    document.addEventListener('keydown', (e) => {
    // Konami code easter egg
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.keyCode);
    window.konamiSequence = window.konamiSequence.slice(-konamiCode.length);
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        // Easter egg triggered!
        document.body.classList.add('konami-activated');
        
        // Add rainbow animation to the name
        const nameParts = document.querySelectorAll('.name-part');
        nameParts.forEach(part => {
            part.classList.add('gradient-text');
        });
        
        // Animate all project visuals
        document.querySelectorAll('.project-visual').forEach(visual => {
            visual.style.animation = 'rainbow-glow 2s ease-in-out infinite';
        });
        
        // Show fun notification
        if (window.portfolio) {
            window.portfolio.showNotification('🎉 Welcome to the matrix! All systems enhanced!', 'success');
        }
        
        setTimeout(() => {
            document.body.classList.remove('konami-activated');
            nameParts.forEach(part => {
                part.classList.remove('gradient-text');
            });
            document.querySelectorAll('.project-visual').forEach(visual => {
                visual.style.animation = '';
            });
        }, 5000);
        
        window.konamiSequence = [];
    }
    });

    // Add konami easter egg styles
    const konamiStyles = `
    <style>
        .konami-activated {
            animation: rainbow-bg 2s ease-in-out infinite;
        }
        
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes rainbow-glow {
            0% { filter: hue-rotate(0deg) brightness(1); }
            50% { filter: hue-rotate(180deg) brightness(1.2); }
            100% { filter: hue-rotate(360deg) brightness(1); }
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
            cursor: pointer;
            font-size: 20px;
            padding: 0 4px;
        }
        
        .notification-icon {
            font-weight: bold;
            font-size: 18px;
        }
        
        /* Smooth scrolling for all browsers */
        html {
            scroll-behavior: smooth;
        }
        
        /* Focus styles for accessibility */
        .brand-link:focus,
        .nav-link:focus,
        .contact-method:focus,
        .social-link:focus {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        
        /* Loading animation for dynamic content */
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', konamiStyles);

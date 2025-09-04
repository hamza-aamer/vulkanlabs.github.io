// Main application class
class Portfolio {
    constructor() {
        this.isLoaded = false;
        this.activeModal = null;
        this.scrollObserver = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateBarcode();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupContactForm();
        this.loadProjects();
        this.handlePageLoad();
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
        
        // Remove loading overlay if exists
        const loadingOverlay = document.querySelector('.page-loading');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => loadingOverlay.remove(), 500);
            }, 1000);
        }
        
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
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
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
            .project-card,
            .timeline-item,
            .skill-tag
        `);

        animateElements.forEach(el => {
            if (this.scrollObserver) {
                this.scrollObserver.observe(el);
            }
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

    loadProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid || typeof projects === 'undefined') return;

        const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
        
        projectsGrid.innerHTML = '';
        
        featuredProjects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.className = `project-card hover-lift scroll-animate stagger-${index + 1}`;
        card.style.opacity = '0';
        
        const placeholder = `
            <div style="
                width: 100%; 
                height: 100%; 
                background: linear-gradient(135deg, var(--cream-4) 0%, var(--cream-5) 100%); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 1.5rem; 
                font-weight: 700;
                color: var(--text-primary);
                text-align: center;
                padding: 2rem;
            ">
                ${project.title.split(':')[0]}
            </div>
        `;
        
        card.innerHTML = `
            <div class="project-image">
                ${placeholder}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.slice(0, 4).map(tech => 
                        `<span class="tech-tag">${tech}</span>`
                    ).join('')}
                    ${project.technologies.length > 4 ? 
                        `<span class="tech-tag">+${project.technologies.length - 4} more</span>` : ''}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.openProjectModal(project);
            card.classList.add('animate-pulse');
            setTimeout(() => card.classList.remove('animate-pulse'), 600);
        });

        return card;
    }

    openProjectModal(project) {
        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <div class="project-header">
                    <h2>${project.title}</h2>
                    <p class="project-subtitle">${project.subtitle || ''}</p>
                </div>
                
                <div class="project-image-large">
                    <div style="
                        width: 100%; 
                        height: 300px; 
                        background: linear-gradient(135deg, var(--cream-4) 0%, var(--cream-5) 100%); 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 2rem; 
                        font-weight: 700;
                        color: var(--text-primary);
                        border-radius: var(--border-radius);
                        margin: var(--space-lg) 0;
                    ">
                        ${project.title.split(':')[0]}
                    </div>
                </div>
                
                <div class="project-details">
                    <div class="project-description-full">
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-achievements">
                        <h4>Key Achievements</h4>
                        <ul>
                            ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-technologies">
                        <h4>Technologies Used</h4>
                        <div class="tech-list">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    
                    ${project.metrics ? `
                        <div class="project-metrics">
                            <h4>Key Metrics</h4>
                            <div class="metrics-grid">
                                ${Object.entries(project.metrics).map(([key, value]) => `
                                    <div class="metric">
                                        <span class="metric-value">${value}</span>
                                        <span class="metric-label">${key}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add modal styles
        this.addModalStyles();
        
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.activeModal = modal;
    }

    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const styles = `
            <style id="modal-styles">
                .project-modal-content {
                    padding: var(--space-lg);
                }
                
                .project-header h2 {
                    font-size: 2rem;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                }
                
                .project-subtitle {
                    color: var(--accent);
                    font-weight: 600;
                    margin-bottom: var(--space-lg);
                }
                
                .project-achievements,
                .project-technologies,
                .project-metrics {
                    margin: var(--space-xl) 0;
                }
                
                .project-achievements h4,
                .project-technologies h4,
                .project-metrics h4 {
                    color: var(--text-primary);
                    margin-bottom: var(--space-md);
                    font-size: 1.2rem;
                    padding-bottom: var(--space-sm);
                    border-bottom: 2px solid var(--cream-4);
                }
                
                .project-achievements ul {
                    list-style: none;
                    padding: 0;
                }
                
                .project-achievements li {
                    padding: var(--space-sm) 0;
                    padding-left: var(--space-lg);
                    position: relative;
                    color: var(--text-secondary);
                }
                
                .project-achievements li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                    font-weight: bold;
                }
                
                .tech-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                }
                
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: var(--space-md);
                }
                
                .metric {
                    text-align: center;
                    padding: var(--space-md);
                    background: var(--cream-3);
                    border-radius: var(--border-radius);
                }
                
                .metric-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--accent);
                    margin-bottom: var(--space-xs);
                }
                
                .metric-label {
                    color: var(--text-light);
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('show');
            setTimeout(() => {
                this.activeModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.activeModal = null;
            }, 300);
        }
    }

    setupInteractions() {
        // Modal close handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });

        // Add click effects to interactive elements
        document.querySelectorAll('.badge, .skill-tag, .social-link').forEach(element => {
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

// Global function for modal close (called from HTML)
function closeModal() {
    if (window.portfolioApp) {
        window.portfolioApp.closeModal();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new Portfolio();
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
        
        // Show fun notification
        if (window.portfolioApp) {
            window.portfolioApp.showNotification('🎉 You found the easter egg! Welcome to the matrix!', 'success');
        }
        
        setTimeout(() => {
            document.body.classList.remove('konami-activated');
            nameParts.forEach(part => {
                part.classList.remove('gradient-text');
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
    </style>
`;

document.head.insertAdjacentHTML('beforeend', konamiStyles);

// Complete JavaScript for Vulkan Labs Website with Dynamic Animations

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

// Advanced Dynamic Scroll Animations Class
class VulkanScrollAnimations {
    constructor() {
        this.init();
        this.setupScrollObserver();
        this.createDynamicBackground();
        this.setupMouseEffects();
        this.createDataVisualization();
        this.setupGlitchEffects();
    }

    init() {
        // Initialize animation system
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
        
        // Animate blobs based on scroll
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
        
        // Create network lines
        for (let i = 0; i < 20; i++) {
            const line = document.createElement('div');
            line.className = 'network-line';
            line.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${Math.random() * 200 + 100}px;
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
            'pipeline.resilient', 'fallback.enabled', 'def neural_net():',
            'import tensorflow', 'cuda.malloc()', 'agent.adapt()',
            'production.ready'
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
        
        // Create floating code particles
        setInterval(() => {
            if (container.children.length < 15 && window.innerWidth > 768) {
                const particle = document.createElement('div');
                particle.className = 'code-particle';
                particle.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                particle.style.cssText = `
                    left: ${Math.random() * 100}%;
                    animation-duration: ${Math.random() * 10 + 15}s;
                    animation-delay: ${Math.random() * 5}s;
                `;
                container.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 20000);
            }
        }, 2000);
        
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
            const scale = 1 + Math.sin(this.scrollProgress * Math.PI * 4) * 0.2;
            const translateY = Math.sin(this.scrollProgress * Math.PI * 2) * 50;
            const translateX = Math.cos(this.scrollProgress * Math.PI * 2) * 30;
            
            blob.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;
        });
        
        // Parallax effect for sections
        this.updateParallaxElements();
    }

    updateParallaxElements() {
        const elements = document.querySelectorAll('.service-card, .project-card, .about-visual');
        
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight && elementTop > -elementHeight) {
                const progress = (windowHeight - elementTop) / (windowHeight + elementHeight);
                const translateY = progress * 30 * (index % 2 === 0 ? 1 : -1);
                const rotateX = progress * 5;
                
                element.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`;
            }
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
        
        // Add new dynamic elements
        this.addDynamicTerminals();
        this.addDataVisualization();
    }

    addDynamicTerminals() {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
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
            
            // Create system monitor terminal
            const systemMonitor = document.createElement('div');
            systemMonitor.className = 'system-monitor-terminal';
            systemMonitor.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <div style="width: 12px; height: 12px; background: #ff5f57; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #ffbd2e; border-radius: 50%;"></div>
                    <div style="width: 12px; height: 12px; background: #28ca42; border-radius: 50%;"></div>
                    <span style="color: #fff; font-size: 0.875rem; margin-left: 1rem;">system_monitor.py</span>
                </div>
                <div class="terminal-line">$ nvidia-smi</div>
                <div class="terminal-line">GPU: RTX 4090 Ti x8 | Temp: 67°C</div>
                <div class="terminal-line">Memory: 192GB VRAM | Usage: 89%</div>
                <div class="terminal-line">Agents: 24 active | Bandwidth: 24TB/s</div>
                <div class="terminal-line">CUDA Cores: 83,968 | Driver: 545.29</div>
                <div class="terminal-line">AI Workload: <span class="highlight">Optimal</span> | Fallbacks: Ready</div>
                <div class="terminal-line">Pipeline Status: <span class="highlight">Resilient</span> <span class="typing-cursor">█</span></div>
            `;
            
            aboutSection.appendChild(terminal);
            aboutSection.appendChild(systemMonitor);
            
            // Animate terminals when visible
            const terminalObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateTerminal(entry.target);
                    }
                });
            });
            
            terminalObserver.observe(terminal);
            terminalObserver.observe(systemMonitor);
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
                
                // Add special effects for highlight text
                const highlight = line.querySelector('.highlight');
                if (highlight) {
                    setTimeout(() => {
                        highlight.style.textShadow = '0 0 15px rgba(255, 107, 107, 0.8)';
                    }, 200);
                }
            }, index * 600); // Slightly slower for better readability
        });
        
        // Add terminal completion sound effect (visual feedback)
        setTimeout(() => {
            const lastLine = lines[lines.length - 1];
            if (lastLine) {
                lastLine.style.borderLeft = '3px solid #00ff41';
                lastLine.style.paddingLeft = '0.5rem';
                lastLine.style.transition = 'all 0.3s ease';
            }
        }, (lines.length * 600) + 500);
    }

    addDataVisualization() {
        const servicesSection = document.querySelector('.services');
        if (servicesSection) {
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
                <div style="margin-bottom: 1rem;">
                    <span style="color: #a1a1aa;">Memory Bandwidth</span>
                    <div class="viz-bar">
                        <div class="viz-bar-fill" data-width="87"></div>
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
                    }, 1500);
                }, 100);
            }, index * 400);
        });
    }

    setupMouseEffects() {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        document.body.appendChild(trail);
        
        let trailDots = [];
        const maxTrailLength = 20;
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            // Create trail dot
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
            
            trail.appendChild(dot);
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
            }, 1000);
        });
    }

    createDynamicBackground() {
        // Add dynamic particles that respond to scroll
        setInterval(() => {
            if (Math.random() > 0.7 && window.innerWidth > 768) {
                this.createScrollParticle();
            }
        }, 1000);
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
            animation: particleRise 8s linear forwards;
        `;
        
        const keyframes = `
            @keyframes particleRise {
                0% {
                    transform: translateY(0px);
                    opacity: 0;
                }
                10%, 90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('#particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = keyframes;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }

    setupGlitchEffects() {
        // Add glitch effect to main titles
        const titles = document.querySelectorAll('h1, h2');
        titles.forEach(title => {
            if (title.textContent.includes('Fragile') || title.textContent.includes('Resilient') || title.textContent.includes('AI')) {
                title.classList.add('glitch-text');
                title.setAttribute('data-text', title.textContent);
            }
        });
    }

    animateElement(element) {
        // Enhanced animation for different element types
        if (element.classList.contains('service-card')) {
            element.style.transform = 'translateY(0) rotateX(0) scale(1)';
            element.style.opacity = '1';
            
            // Add holographic effect
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease';
            }, 600);
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
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const website = new VulkanLabsWebsite();
    
    // Initialize advanced features after a short delay
    setTimeout(() => {
        website.initAdvancedFeatures();
        
        // Initialize dynamic scroll animations
        window.vulkanScrollAnimations = new VulkanScrollAnimations();
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
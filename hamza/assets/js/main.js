class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupInteractions();
        this.handlePageLoad();
    }

    handlePageLoad() {
        setTimeout(() => {
            document.body.classList.add('loaded');
            this.animateHeroElements();
        }, 500);
    }

    animateHeroElements() {
        const badges = document.querySelectorAll('.badge');
        const floatElements = document.querySelectorAll('.float-element');
        
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 800 + (index * 200));
        });

        floatElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
            }, 1200 + (index * 300));
        });
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

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const nav = document.querySelector('.nav');
            
            if (scrollTop > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
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
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    handleFormSubmit(form) {
        const submitBtn = form.querySelector('.submit-btn');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all fields correctly', 'error');
            return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            inputs.forEach(input => {
                input.parentElement.classList.remove('focused', 'error', 'success');
            });

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    }

    setupInteractions() {
        document.querySelectorAll('.badge, .skill-tag, .tech-tag').forEach(element => {
            element.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444', 
            info: '#3b82f6'
        };

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.firstElementChild.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new Portfolio();
});

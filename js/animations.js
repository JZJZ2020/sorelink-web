// SORELINK - UFIspace-inspired animations logic

document.addEventListener('DOMContentLoaded', function () {
    // 1. Reveal on scroll using Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If the target contains stagger-items, reveal them with delays
                const staggers = entry.target.querySelectorAll('.stagger-item');
                staggers.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 150);
                });
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Navbar Scroll Logic
    const navbar = document.querySelector('.navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Initial check

    // 3. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Custom Cursor Follower
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    // Show/hide custom cursor only in hero area
    const heroContainer = document.querySelector('.hero-swiper-container');

    const updateCursorArea = (clientX, clientY) => {
        if (heroContainer) {
            const bounds = heroContainer.getBoundingClientRect();
            if (clientX >= bounds.left && clientX <= bounds.right &&
                clientY >= bounds.top && clientY <= bounds.bottom) {
                document.body.classList.add('cursor-in-hero');
            } else {
                document.body.classList.remove('cursor-in-hero');
            }
        } else {
            document.body.classList.remove('cursor-in-hero');
        }
    };

    let lastMouseX = 0;
    let lastMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        });

        updateCursorArea(e.clientX, e.clientY);
    });

    document.addEventListener('scroll', () => {
        updateCursorArea(lastMouseX, lastMouseY);
    }, { passive: true });

    const interactiveElements = document.querySelectorAll('a, button, .hover-lift, .card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // 5. Initialize Swiper for Hero
    if (document.querySelector('.heroSwiper')) {
        const swiper = new Swiper(".heroSwiper", {
            loop: true,
            speed: 1200,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: ".swiper-pagination-hero",
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + '"></span>';
                },
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            on: {
                slideChangeTransitionStart: function () {
                    // Reset animations in slides
                    const masks = document.querySelectorAll('.hero-reveal-mask span, .hero-reveal-text, .hero-reveal-subtitle, .hero-reveal-btn, .text-info, .text-danger');
                    masks.forEach(el => {
                        el.style.animation = 'none';
                        el.offsetHeight; // trigger reflow
                        el.style.animation = '';
                    });
                }
            }
        });
    }

    // 6. Splash Screen / Initial Center Animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        document.body.classList.add('splash-active');
        setTimeout(() => {
            document.body.classList.remove('splash-active');
        }, 1500);
    }

    // 6. Vivid Technical Background (Particles)
    function initParticles() {
        const sections = document.querySelectorAll('.hero-section');
        sections.forEach(section => {
            const canvas = document.createElement('canvas');
            canvas.className = 'hero-particles-canvas';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '2';
            canvas.style.pointerEvents = 'none';
            canvas.width = section.offsetWidth;
            canvas.height = section.offsetHeight;
            section.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            let particlesArray = [];
            const numberOfParticles = 30;

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.speedX = Math.random() * 0.5 - 0.25;
                    this.speedY = Math.random() * 0.5 - 0.25;
                    this.opacity = Math.random() * 0.5;
                }
                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x > canvas.width) this.x = 0;
                    if (this.x < 0) this.x = canvas.width;
                    if (this.y > canvas.height) this.y = 0;
                    if (this.y < 0) this.y = canvas.height;
                }
                draw() {
                    ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                    particlesArray[i].draw();
                }
                requestAnimationFrame(animate);
            }
            animate();
        });
    }

    if (window.innerWidth > 768) {
        initParticles();
    }

    console.log('SORELINK animations initialized.');
});

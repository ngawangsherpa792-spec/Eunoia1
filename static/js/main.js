// EUNOIA Technologies - Main JavaScript File
// Advanced animations and interactions

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Loading Screen
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        loader.style.display = 'none';
                        initAnimations();
                    }
                });
            }, 500);
        }
        loaderProgress.style.width = progress + '%';
    }, 150);

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice && cursor) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            cursor.style.left = cursorX - 10 + 'px';
            cursor.style.top = cursorY - 10 + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects for cursor
        const hoverElements = document.querySelectorAll('a, button, .course-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navigation Background on Scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('bg-cyber-darker/95', 'shadow-lg', 'shadow-black/20');
        } else {
            navbar.classList.remove('bg-cyber-darker/95', 'shadow-lg', 'shadow-black/20');
        }
    }, { passive: true });

    // Progress Bar
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        progressBar.style.transform = `scaleX(${scrollPercent})`;
    }, { passive: true });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Particle System
    initParticles();

    // 3D Hero Background
    initHero3D();

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const submitBtnText = submitBtn.querySelector('span');
        const originalText = submitBtnText.innerText;

        try {
            // UI Loading State
            submitBtn.disabled = true;
            submitBtnText.innerText = 'SENDING...';

            const formData = {
                first_name: contactForm.querySelector('input[placeholder="John"]').value,
                last_name: contactForm.querySelector('input[placeholder="Doe"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                course: contactForm.querySelector('select').value,
                message: contactForm.querySelector('textarea').value
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.status === 'success') {
                showToast(result.message);
                contactForm.reset();
            } else {
                showToast('Error: ' + (result.message || 'Something went wrong'), true);
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showToast('Failed to connect to the server.', true);
        } finally {
            submitBtn.disabled = false;
            submitBtnText.innerText = originalText;
        }
    });

    // Magnetic Buttons
    initMagneticButtons();

    // Text Scramble Effect for Hero
    initTextScramble();

    // Dynamic Glitch Trigger
    initGlitchTrigger();
});

// Initialize GSAP Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const heroTl = gsap.timeline();
    heroTl
        .from('#hero-title-1', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        })
        .from('#hero-title-2', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.7')
        .from('#hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('#hero-tagline', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

    revealElements.forEach((el, index) => {
        const delay = el.style.transitionDelay ? parseFloat(el.style.transitionDelay) : 0;

        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: delay,
            ease: 'power3.out'
        });
    });

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });

    // Parallax Effects
    gsap.to('.course-card', {
        scrollTrigger: {
            trigger: '#courses',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -30,
        stagger: 0.1
    });
}

// Particle System
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = Math.random() > 0.5 ? '#00d4ff' : '#8338ec';
            this.opacity = Math.random() * 0.5 + 0.2;
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
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles (limited for performance)
    const particleCount = window.innerWidth < 768 ? 25 : 50;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let frameCount = 0;
    function animate() {
        if (!isActive) return;

        frameCount++;
        // Render every 2nd frame for performance
        if (frameCount % 2 === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections (limited)
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = '#00d4ff';
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100 && connections < 3) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        connections++;
                    }
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    // Visibility check for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });

    animate();
}

// 3D Hero Background with Three.js
function initHero3D() {
    const container = document.getElementById('hero-canvas');
    if (!container || window.matchMedia('(pointer: coarse)').matches) {
        // Fallback for mobile
        if (container) {
            container.style.background = 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, transparent 70%)';
        }
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create geometric shapes
    const geometry1 = new THREE.IcosahedronGeometry(2, 0);
    const material1 = new THREE.MeshBasicMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere1 = new THREE.Mesh(geometry1, material1);
    sphere1.position.set(5, 0, -5);
    scene.add(sphere1);

    const geometry2 = new THREE.OctahedronGeometry(1.5, 0);
    const material2 = new THREE.MeshBasicMaterial({
        color: 0x8338ec,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const sphere2 = new THREE.Mesh(geometry2, material2);
    sphere2.position.set(-5, 2, -8);
    scene.add(sphere2);

    const geometry3 = new THREE.TetrahedronGeometry(1, 0);
    const material3 = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const sphere3 = new THREE.Mesh(geometry3, material3);
    sphere3.position.set(0, -3, -6);
    scene.add(sphere3);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Animation
    let isActive = true;
    function animate() {
        if (!isActive) return;

        requestAnimationFrame(animate);

        sphere1.rotation.x += 0.001;
        sphere1.rotation.y += 0.002;

        sphere2.rotation.x -= 0.002;
        sphere2.rotation.y += 0.001;

        sphere3.rotation.x += 0.003;
        sphere3.rotation.y -= 0.001;

        particlesMesh.rotation.y += 0.0005;

        // Mouse parallax
        sphere1.position.x = 5 + mouseX * 0.5;
        sphere1.position.y = mouseY * 0.5;

        sphere2.position.x = -5 + mouseX * 0.3;
        sphere2.position.y = 2 + mouseY * 0.3;

        renderer.render(scene, camera);
    }

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    // Visibility check
    document.addEventListener('visibilitychange', () => {
        isActive = !document.hidden;
        if (isActive) animate();
    });

    animate();
}

// Magnetic Buttons
function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Text Scramble Effect
function initTextScramble() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;

    const chars = '!<>-_\/[]{}—=+*^?#________';
    const originalText = el.innerText;
    let iteration = 0;

    const scramble = () => {
        iteration = 0;
        const interval = setInterval(() => {
            el.innerText = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 2;
        }, 30);
    };

    setTimeout(scramble, 1500);

    // Scramble again on hover
    el.addEventListener('mouseenter', scramble);
}

// Dynamic Glitch Trigger
function initGlitchTrigger() {
    const glitchElements = document.querySelectorAll('.glitch');

    glitchElements.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                el.classList.add('active-glitch');
                setTimeout(() => el.classList.remove('active-glitch'), 200);
            }
        }, 1000);
    });
}

// Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    // Target either the original i tag or the svg tag Lucide replaces it with
    const toastIcon = toast.querySelector('i, svg');

    if (!toast || !toastMessage || !toastIcon) return;

    toastMessage.innerText = message;

    if (isError) {
        toastIcon.setAttribute('data-lucide', 'circle-x');
        toastIcon.classList.remove('text-cyber-blue');
        toastIcon.classList.add('text-cyber-pink');
    } else {
        toastIcon.setAttribute('data-lucide', 'check-circle');
        toastIcon.classList.remove('text-cyber-pink');
        toastIcon.classList.add('text-cyber-blue');
    }

    // Re-initialize icon to apply changes
    if (window.lucide) {
        lucide.createIcons();
    }

    toast.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Note: Glitch randomizer removed to prevent flickering; CSS infinite animations handle the effect.

// Course Card Tilt Effect
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

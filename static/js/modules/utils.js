// Utility functions: Magnetic buttons, Text Scramble, Glitch effects, Card Tilt

export function initUtils() {
    initMagneticButtons();
    initTextScramble();
    initGlitchTrigger();
    initCardTilt();
    initParallaxIcons();
}

function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if (window.gsap) {
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    scale: 1.25,
                    duration: 0.3,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            } else {
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.25)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)',
                    overwrite: 'auto'
                });
            } else {
                btn.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    });
}

function initTextScramble() {
    const el = document.getElementById('hero-subtitle');
    if (!el) return;

    const chars = '!<>-_\\/[]{}=+*^?#________';
    const originalText = el.textContent.trim();
    // Store as source of truth
    el.dataset.original = originalText;
    let isRunning = false;

    const scramble = () => {
        if (isRunning) return;
        isRunning = true;
        let iteration = 0;
        const text = el.dataset.original;

        const interval = setInterval(() => {
            el.textContent = text
                .split('')
                .map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= text.length) {
                clearInterval(interval);
                // Ensure clean final text
                el.textContent = text;
                isRunning = false;
            }

            iteration += 1;
        }, 40);
    };

    setTimeout(scramble, 1500);
    el.addEventListener('mouseenter', scramble);
}

function initGlitchTrigger() {
    const glitchElements = document.querySelectorAll('.glitch:not(.glitch-layer)');

    glitchElements.forEach(el => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                el.classList.add('active-glitch');
                setTimeout(() => el.classList.remove('active-glitch'), 200);
            }
        }, 1000);
    });
}

function initCardTilt() {
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
}

function initParallaxIcons() {
    const icons = document.querySelectorAll('.parallax-icon');
    if (!icons.length || window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        icons.forEach(icon => {
            const strength = parseFloat(icon.dataset.strength) || 20;
            const x = mouseX * strength;
            const y = mouseY * strength;
            
            if (window.gsap) {
                gsap.to(icon, {
                    x: x,
                    y: y,
                    duration: 1,
                    ease: 'power2.out'
                });
            } else {
                icon.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    });
}

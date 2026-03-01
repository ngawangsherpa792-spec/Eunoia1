// Utility functions: Magnetic buttons, Text Scramble, Glitch effects, Card Tilt

export function initUtils() {
    initMagneticButtons();
    initTextScramble();
    initGlitchTrigger();
    initCardTilt();
}

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
    el.addEventListener('mouseenter', scramble);
}

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

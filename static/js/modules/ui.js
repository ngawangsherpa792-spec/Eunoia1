// UI interactions: Custom Cursor, Progress Bar, Mobile Menu, Navbar Scroll

export function initUI() {
    initCursor();
    initMobileMenu();
    initNavbarScroll();
    initProgressBar();
    initSmoothScroll();
}

function initCursor() {
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
}

function initMobileMenu() {
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
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('bg-cyber-darker/95', 'shadow-lg', 'shadow-black/20');
        } else {
            navbar.classList.remove('bg-cyber-darker/95', 'shadow-lg', 'shadow-black/20');
        }
    }, { passive: true });
}

function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        if (progressBar) {
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        }
    }, { passive: true });
}

function initSmoothScroll() {
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
}

export function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast?.querySelector('i, svg');

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

    if (window.lucide) {
        lucide.createIcons();
    }

    toast.classList.remove('translate-y-20', 'opacity-0');

    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// GSAP Animations and ScrollTriggers

export function initAnimations() {
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

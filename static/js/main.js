// EUNOIA Technologies - Main Entry Point (ES6 Modules)
import { initUI } from './modules/ui.js';
import { initAnimations } from './modules/animations.js';
import { initParticles } from './modules/particles.js';
import { initHero3D } from './modules/threeHero.js';
import { initForm } from './modules/form.js';
import { initUtils } from './modules/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Loading Screen Handling
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    let progress = 0;

    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                if (window.gsap) {
                    gsap.to(loader, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            if (loader) loader.style.display = 'none';
                            startApp();
                        }
                    });
                } else {
                    if (loader) loader.style.display = 'none';
                    startApp();
                }
            }, 500);
        }
        if (loaderProgress) loaderProgress.style.width = progress + '%';
    }, 150);
});

function startApp() {
    // Initialize all modules
    initUI();
    initAnimations();
    initParticles();
    initHero3D();
    initForm();
    initUtils();

    console.log('EUNOIA System fully initialized.');
}

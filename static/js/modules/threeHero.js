// 3D Hero Background with Three.js

export function initHero3D() {
    const container = document.getElementById('hero-canvas');
    if (!container || window.matchMedia('(pointer: coarse)').matches) {
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

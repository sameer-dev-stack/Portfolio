document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded. Service icons cannot be initialized.');
        return;
    }

    const serviceCards = document.querySelectorAll('.service-card[data-service-id]');
    const iconColor = 0x00f7ff; // Teal to match theme

    const iconConfigs = {
        'web-dev': { // Globe-like, multifaceted
            geometry: new THREE.DodecahedronGeometry(22, 0),
            rotationSpeed: { x: 0.01, y: 0.015 }
        },
        'ai-integration': { // Complex node / core
            geometry: new THREE.IcosahedronGeometry(24, 0),
            rotationSpeed: { x: 0.015, y: 0.01 }
        },
        'prompt-eng': { // Abstract, flowing, language
            geometry: new THREE.TorusKnotGeometry(18, 6, 60, 10),
            rotationSpeed: { x: 0.01, y: 0.012 }
        },
        'landing-opt': { // Upward pointing, growth
            geometry: new THREE.ConeGeometry(18, 35, 16),
            rotationSpeed: { x: 0.00, y: 0.015 } // Rotate mainly on Y for cone
        },
        'automation': { // Gear-like or process component
            geometry: new THREE.CylinderGeometry(16, 16, 25, 12), // (radiusTop, radiusBottom, height, radialSegments)
            rotationSpeed: { x: 0.015, y: 0.015 }
        },
        'web3-dev': { // Block
            geometry: new THREE.BoxGeometry(25, 25, 25),
            rotationSpeed: { x: 0.01, y: 0.01 }
        }
    };

    serviceCards.forEach(card => {
        const container = card.querySelector('.service-icon-3d-container');
        const serviceId = card.getAttribute('data-service-id');
        const config = iconConfigs[serviceId];

        if (!container || !config) {
            console.warn(`Container or config not found for service ID: ${serviceId}`);
            return;
        }

        let scene, camera, renderer, mesh;

        function initIcon() {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 1, 1000);
            camera.position.z = 70; // Closer for smaller icons

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background
            container.appendChild(renderer.domElement);

            // Mesh
            const material = new THREE.MeshStandardMaterial({
                color: iconColor,
                wireframe: true,
                emissive: iconColor, // Make wireframe glow a bit
                emissiveIntensity: 0.3
            });
            mesh = new THREE.Mesh(config.geometry, material);
            scene.add(mesh);

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0xffffff, 0.8);
            pointLight.position.set(50, 50, 50);
            scene.add(pointLight);

            // Animation
            animateIcon();

            // Hover animation
            card.addEventListener('mouseenter', () => {
                // Simple scale up on hover
                gsap.to(mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
            });
        }

        function animateIcon() {
            requestAnimationFrame(animateIcon);
            if (mesh) {
                mesh.rotation.x += config.rotationSpeed.x;
                mesh.rotation.y += config.rotationSpeed.y;
            }
            renderer.render(scene, camera);
        }
        
        // Ensure GSAP is loaded (optional, for hover animation)
        // If not using GSAP, remove the hover listeners or use CSS transitions/manual animation
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, hover animations for service icons might not work as intended.');
        }


        // Use Intersection Observer to initialize only when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!renderer) { // Initialize only once
                        initIcon();
                    }
                    observer.unobserve(card); // Stop observing once initialized
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the card is visible

        observer.observe(card);

        // Handle resize - this is a bit tricky for multiple canvases.
        // A more robust solution might involve a shared resize handler.
        window.addEventListener('resize', () => {
            if (renderer && camera && container) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }, false);
    });
});

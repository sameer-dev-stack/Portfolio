document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded. Scroll accents cannot be initialized.');
        return;
    }

    console.log("Initializing scroll accents...");
    const accentColor = 0x00f7ff; // Teal to match theme

    // Find all accent containers
    const accentContainers = document.querySelectorAll('.scroll-accent-container');

    accentContainers.forEach(container => {
        const accentType = container.dataset.accentType || 'line'; // Default to 'line'
        let scene, camera, renderer, mesh;
        let animationId = null;
        let isInitialized = false;

        const accentGeometries = {
            line: new THREE.BoxGeometry(200, 1, 1), // A thin line
            cube: new THREE.BoxGeometry(20, 20, 20),
            torus: new THREE.TorusGeometry(15, 5, 8, 25),
            sphere: new THREE.SphereGeometry(15, 16, 16)
        };

        function initAccent() {
            if (isInitialized) return;
            isInitialized = true;

            // Scene
            scene = new THREE.Scene();

            // Camera
            const aspect = container.clientWidth / container.clientHeight;
            camera = new THREE.PerspectiveCamera(50, aspect, 1, 1000);
            camera.position.z = 50; // Adjust distance based on accent size

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background
            container.appendChild(renderer.domElement);

            // Geometry & Material
            const geometry = accentGeometries[accentType] || accentGeometries.line;
            const material = new THREE.MeshBasicMaterial({
                color: accentColor,
                wireframe: true
            });
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Initial animation state if needed (e.g., GSAP fade-in)
            mesh.rotation.x = Math.random() * Math.PI; // Random initial rotation
            mesh.rotation.y = Math.random() * Math.PI;

            console.log(`Accent initialized: ${accentType}`, container);
            animateAccent(); // Start animation loop
        }

        function animateAccent() {
            animationId = requestAnimationFrame(animateAccent);
            if (mesh && renderer) {
                // Simple rotation
                mesh.rotation.x += 0.005;
                mesh.rotation.y += 0.007;
                renderer.render(scene, camera);
            }
        }

        function stopAnimation() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }

        // Observer to trigger animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // console.log('Accent intersecting:', container);
                    if (!isInitialized) {
                        initAccent();
                    } else if (!animationId) {
                        // Restart animation if stopped
                        animateAccent();
                    }
                } else {
                    // Optional: Stop animation when not visible to save resources
                    stopAnimation();
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% visible

        observer.observe(container);

        // Basic resize handling
        window.addEventListener('resize', () => {
            if (renderer && camera && container && container.clientWidth > 0 && container.clientHeight > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }, false);
    });
});

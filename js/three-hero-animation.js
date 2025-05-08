document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) {
        console.error('Hero canvas container not found');
        return;
    }

    let scene, camera, renderer;
    let particles, particleSystem;
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const particleCount = 5000;
    const particleColor = 0x00f7ff; // Teal color to match your theme

    function init() {
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 10000);
        camera.position.z = 1000;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true for transparent background
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);

        // Particles
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3); // For individual particle movement

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() * 2 - 1) * 2000; // x
            positions[i + 1] = (Math.random() * 2 - 1) * 2000; // y
            positions[i + 2] = (Math.random() * 2 - 1) * 2000; // z

            velocities[i] = (Math.random() - 0.5) * 0.5; // vx
            velocities[i+1] = (Math.random() - 0.5) * 0.5; // vy
            velocities[i+2] = (Math.random() - 0.5) * 0.5; // vz
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));


        const particleMaterial = new THREE.PointsMaterial({
            color: particleColor,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });

        particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particleSystem);

        // Event Listeners
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.00005; // Slower overall system rotation

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02; // Smoother camera follow
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Animate particles
        const positions = particleSystem.geometry.attributes.position.array;
        const velocities = particleSystem.geometry.attributes.velocity.array;

        for (let i = 0; i < particleCount * 3; i += 3) {
            // Basic velocity-based movement
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Boundary check - wrap around
            if (positions[i] > 2000 || positions[i] < -2000) velocities[i] *= -1;
            if (positions[i + 1] > 2000 || positions[i + 1] < -2000) velocities[i + 1] *= -1;
            if (positions[i + 2] > 2000 || positions[i + 2] < -2000) velocities[i + 2] *= -1;

            // Enhanced mouse interaction - particles move away from mouse
            let camAdjustedMouseX = camera.position.x + mouseX * 0.2; // Mouse influence relative to camera
            let camAdjustedMouseY = camera.position.y - mouseY * 0.2; // Inverted Y for screen coords

            let dx = positions[i] - camAdjustedMouseX;
            let dy = positions[i+1] - camAdjustedMouseY;
            // let dz = positions[i+2] - camera.position.z; // Could add Z-depth interaction later
            let dist = Math.sqrt(dx*dx + dy*dy); // Consider 2D distance for screen-like interaction

            const interactionRadius = 250; // Increased radius of mouse influence
            const maxForce = 2.5; // Increased maximum force

            if (dist < interactionRadius) {
                let forceFactor = (interactionRadius - dist) / interactionRadius; // 1 at center, 0 at edge
                let force = forceFactor * maxForce;

                // Apply repulsion force
                positions[i] += (dx / dist) * force;
                positions[i+1] += (dy / dist) * force;

                // Optional: Add a slight upward 'pop' or z-axis movement
                // positions[i+2] += force * 0.5;
            }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Rotate the whole particle system slowly for a cosmic feel
        particleSystem.rotation.x += 0.0001;
        particleSystem.rotation.y += 0.0002;

        renderer.render(scene, camera);
    }

    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded. Ensure it is included before this script.');
        // Optionally, load it dynamically if not present, though CDN in HTML is preferred.
        // const script = document.createElement('script');
        // script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
        // script.onload = () => {
        //     console.log('Three.js loaded dynamically.');
        //     init();
        //     animate();
        // };
        // document.head.appendChild(script);
        return;
    }


    init();
    animate();
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Загрузка модели
const loader = new THREE.GLTFLoader();
loader.load('engine3dmodel.glb', 
    function(gltf) {
        console.log("✅ Модель загружена успешно!");
        scene.add(gltf.scene);
        
        // Автоповорот для демонстрации
        function animate() {
            requestAnimationFrame(animate);
            gltf.scene.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    },
    function(progress) {
        console.log("Загрузка: " + (progress.loaded / progress.total * 100) + "%");
    },
    function(error) {
        console.error("❌ Ошибка загрузки модели:", error);
        // Если модель не загружается, покажем куб
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        
        function animate() {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();
    }
);

camera.position.z = 5;

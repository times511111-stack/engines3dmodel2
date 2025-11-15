const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Освещение
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

camera.position.z = 5;

// ПРОВЕРКА: добавляем куб чтобы убедиться что Three.js работает
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

console.log("🚀 Three.js запущен! Должен быть красный куб");

// Пробуем загрузить модель
const loader = new THREE.GLTFLoader();

// Добавляем случайный параметр чтобы избежать кэширования
const modelUrl = 'engine3dmodel.glb?v=' + Date.now();

loader.load(modelUrl, 
    function(gltf) {
        console.log("✅ Модель загружена успешно!");
        // Убираем тестовый куб
        scene.remove(cube);
        // Добавляем модель
        scene.add(gltf.scene);
    },
    function(progress) {
        console.log("📊 Прогресс загрузки:", progress);
    },
    function(error) {
        console.error("❌ Ошибка загрузки модели:", error);
        console.log("Файл не найден! Проверьте:");
        console.log("1. Название файла на GitHub");
        console.log("2. Что файл в той же папке что index.html");
        console.log("3. Размер файла (должен быть > 1MB)");
        
        // Оставляем красный куб как индикатор ошибки
    }
);

// Анимация
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

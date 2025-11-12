// === НАЧАЛО ФАЙЛА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === ПЕРЕМЕННЫЕ ДЛЯ МЫШКИ ===
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let model = null;

// === ОСВЕЩЕНИЕ ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// === ЗАГРУЗЧИК МОДЕЛИ ===
const loader = new THREE.GLTFLoader();

// === ЗАГРУЗКА МОДЕЛИ - ВАЖНО: название engine3dmodel.glb ===
loader.load('engine3dmodel.glb', function(gltf) {
    console.log("✅ Модель загружена!");
    model = gltf.scene;
    scene.add(model);
    
    // Автоматическое воспроизведение анимации
    const mixer = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
        
        // Анимационный цикл
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            mixer.update(clock.getDelta());
            renderer.render(scene, camera);
        }
        animate();
    } else {
        // Если анимаций нет
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }
    
}, function(error) {
    console.error("❌ Ошибка загрузки:", error);
});

camera.position.z = 5;

// === ФУНКЦИИ ДЛЯ МЫШКИ ===
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);

function onMouseDown(event) {
    isMouseDown = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseMove(event) {
    if (!isMouseDown || !model) return;
    
    const deltaX = event.clientX - previousMouseX;
    const deltaY = event.clientY - previousMouseY;
    
    // Вращение модели
    model.rotation.y += deltaX * 0.01;
    model.rotation.x += deltaY * 0.01;
    
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}
// === КОНЕЦ ФАЙЛА ===

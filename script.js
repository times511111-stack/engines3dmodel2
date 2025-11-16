// Основные переменные
let scene, camera, renderer, currentModel;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Инициализация сцены
function init() {
    // Создаем сцену с чёрным фоном
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Создаем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    
    // Создаем рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Загружаем модель
    loadModel();
    
    // Настройка управления
    setupControls();
    
    // Запуск анимации
    animate();
}

// Загрузка модели
function loadModel() {
    if (typeof THREE.GLTFLoader === 'undefined') {
        createTestModel();
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'engine3dmodel.glb',
        // Успешная загрузка
        function(gltf) {
            currentModel = gltf.scene;
            scene.add(currentModel);
            
            // Центрируем модель
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(center);
        },
        // Ошибка загрузки
        function(error) {
            createTestModel();
        }
    );
}

// Создание тестовой модели
function createTestModel() {
    const group = new THREE.Group();
    
    // Основа двигателя
    const engineGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    group.add(engine);
    
    // Поршни (4 штуки)
    const pistonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
    const pistonMaterial = new THREE.MeshPhongMaterial({ color: 0xff4444 });
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
        piston.position.x = Math.cos(angle) * 1.2;
        piston.position.z = Math.sin(angle) * 1.2;
        piston.position.y = 0.5;
        group.add(piston);
    }
    
    // Коленвал
    const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 12);
    const shaftMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    group.add(shaft);
    
    scene.add(group);
    currentModel = group;
}

// Настройка управления
function setupControls() {
    renderer.domElement.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (!isMouseDown || !currentModel) return;
        
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        
        currentModel.rotation.y += deltaX * 0.01;
        currentModel.rotation.x += deltaY * 0.01;
        
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    renderer.domElement.addEventListener('wheel', (e) => {
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(2, Math.min(20, camera.position.z));
    });
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Анимация - ТОЛЬКО отрисовка, без вращения
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Запуск при загрузке страницы
window.addEventListener('load', init);

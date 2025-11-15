// Основные переменные
let scene, camera, renderer, currentModel;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Функция для обновления статуса (безопасная)
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log(message);
}

// Инициализация сцены
function init() {
    console.log('🚀 Инициализация 3D сцены...');
    updateStatus('🚀 Загрузка 3D...');
    
    // Создаем сцену
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
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
    
    // Сразу создаем тестовую модель
    createTestModel();
    updateStatus('✅ Тестовый двигатель загружен');
    
    // Пытаемся загрузить основную модель
    loadMainModel();
    
    // Настройка управления
    setupControls();
    
    // Запуск анимации
    animate();
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

// Загрузка основной модели
function loadMainModel() {
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.log('GLTFLoader не доступен');
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        'engine3dmodel.glb',
        // Успешная загрузка
        function(gltf) {
            console.log('✅ Основная модель загружена!');
            updateStatus('✅ Основная модель загружена');
            
            // Удаляем тестовую модель
            if (currentModel) {
                scene.remove(currentModel);
            }
            
            // Добавляем основную модель
            currentModel = gltf.scene;
            scene.add(currentModel);
            
            // Центрируем модель
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            currentModel.position.sub(center);
            
            // Запускаем анимации если есть
            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(currentModel);
                gltf.animations.forEach(clip => {
                    mixer.clipAction(clip).play();
                });
                scene.userData.mixer = mixer;
            }
        },
        // Прогресс загрузки
        function(progress) {
            const percent = (progress.loaded / (progress.total || 1)) * 100;
            updateStatus(`📥 Загрузка модели... ${percent.toFixed(1)}%`);
        },
        // Ошибка загрузки
        function(error) {
            console.log('ℹ️ Основная модель не загружена');
            updateStatus('✅ Тестовый двигатель (основная модель не найдена)');
        }
    );
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

// Анимация
function animate() {
    requestAnimationFrame(animate);
    
    // Обновляем анимации если есть
    if (scene.userData && scene.userData.mixer) {
        scene.userData.mixer.update(0.016);
    }
    
    // Анимируем тестовую модель
    if (currentModel) {
        currentModel.rotation.y += 0.005;
        
        // Анимируем поршни если это тестовая модель
        if (currentModel.children.length >= 6) {
            const time = Date.now() * 0.005;
            for (let i = 1; i <= 4; i++) {
                const piston = currentModel.children[i];
                if (piston) {
                    piston.position.y = 0.5 + Math.sin(time + i) * 0.3;
                }
            }
        }
    }
    
    renderer.render(scene, camera);
}

// Запуск при загрузке страницы
window.addEventListener('load', init);

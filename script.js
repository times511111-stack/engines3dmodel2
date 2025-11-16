// Основные переменные
let scene, camera, renderer, currentModel, mixer;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let animations = [];

// Инициализация сцены
function init() {
    // Создаем сцену с чёрным фоном
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Создаем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    
    // Создаем рендерер
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Правильная цветовая схема
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Улучшенный тональный mapping
    renderer.toneMappingExposure = 1; // Экспозиция
    document.body.appendChild(renderer.domElement);
    
    // Улучшенное освещение для текстур
    setupLighting();
    
    // Загружаем модель
    loadModel();
    
    // Настройка управления
    setupControls();
    
    // Запуск анимации
    animate();
}

// Улучшенное освещение
function setupLighting() {
    // Основной окружающий свет (увеличим интенсивность)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Увеличил до 1.0
    scene.add(ambientLight);
    
    // Основной направленный свет
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.5); // Увеличил интенсивность
    directionalLight1.position.set(10, 10, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);
    
    // Дополнительный свет с другой стороны
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    // Верхний свет
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight3.position.set(0, 10, 0);
    scene.add(directionalLight3);
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
            console.log('✅ Модель загружена!');
            
            // Сохраняем анимации
            animations = gltf.animations || [];
            console.log('Найдено анимаций:', animations.length);
            
            currentModel = gltf.scene;
            scene.add(currentModel);
            
            // Центрируем модель
            centerModel();
            
            // Настраиваем материалы для правильного отображения
            setupMaterials(currentModel);
            
            // Обновляем статус
            updateStatus(`✅ Модель загружена (анимаций: ${animations.length})`);
            
            // Показываем кнопку если есть анимации
            if (animations.length > 0) {
                document.getElementById('playAnim').style.display = 'block';
            }
        },
        // Прогресс загрузки
        function(progress) {
            const percent = (progress.loaded / (progress.total || 1)) * 100;
            updateStatus(`📥 Загрузка модели... ${percent.toFixed(1)}%`);
        },
        // Ошибка загрузки
        function(error) {
            console.log('Ошибка загрузки основной модели:', error);
            createTestModel();
            updateStatus('✅ Тестовый двигатель загружен');
        }
    );
}

// Центрирование модели
function centerModel() {
    if (!currentModel) return;
    
    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Центрируем модель
    currentModel.position.x = -center.x;
    currentModel.position.y = -center.y;
    currentModel.position.z = -center.z;
    
    // Настраиваем камеру чтобы модель была полностью видна
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    
    camera.position.z = cameraZ * 1.5;
    camera.lookAt(0, 0, 0);
}

// Настройка материалов для правильного отображения текстур
function setupMaterials(model) {
    model.traverse((child) => {
        if (child.isMesh) {
            // Включаем тени
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Если материал уже есть, убедимся что он правильно настроен
            if (child.material) {
                // Для стандартных материалов
                if (child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMapIntensity = 1.0;
                }
                
                // Включаем обновление текстур
                child.material.needsUpdate = true;
            }
        }
    });
}

// Запуск анимаций
function playAnimations() {
    if (animations.length === 0 || !currentModel) {
        console.log('Нет анимаций для воспроизведения');
        return;
    }
    
    // Создаем миксер анимаций
    mixer = new THREE.AnimationMixer(currentModel);
    
    // Запускаем все анимации
    animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
        console.log('Запущена анимация:', clip.name);
    });
    
    updateStatus('🎬 Анимации запущены');
    document.getElementById('playAnim').textContent = '⏸️ Остановить анимации';
    document.getElementById('playAnim').onclick = stopAnimations;
}

// Остановка анимаций
function stopAnimations() {
    if (mixer) {
        mixer.stopAllAction();
        mixer = null;
    }
    
    updateStatus('⏹️ Анимации остановлены');
    document.getElementById('playAnim').textContent = '▶️ Включить анимации';
    document.getElementById('playAnim').onclick = playAnimations;
}

// Создание тестовой модели
function createTestModel() {
    const group = new THREE.Group();
    
    // Основа двигателя
    const engineGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
    const engineMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.7,
        metalness: 0.3
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    group.add(engine);
    
    // Поршни (4 штуки)
    const pistonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
    const pistonMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff4444,
        roughness: 0.5,
        metalness: 0.5
    });
    
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
    const shaftMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
        roughness: 0.3,
        metalness: 0.8
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    group.add(shaft);
    
    scene.add(group);
    currentModel = group;
    
    // Скрываем кнопку анимаций для тестовой модели
    document.getElementById('playAnim').style.display = 'none';
}

// Настройка управления
function setupControls() {
    // Управление мышью
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
    
    // Zoom колесиком
    renderer.domElement.addEventListener('wheel', (e) => {
        camera.position.z += e.deltaY * 0.01;
        camera.position.z = Math.max(2, Math.min(50, camera.position.z));
    });
    
    // Кнопка воспроизведения анимаций
    document.getElementById('playAnim').onclick = playAnimations;
    
    // Кнопка сброса вида
    document.getElementById('resetView').onclick = () => {
        if (currentModel) {
            currentModel.rotation.x = 0;
            currentModel.rotation.y = 0;
            currentModel.rotation.z = 0;
            centerModel();
        }
    };
    
    // Изменение размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Анимация
function animate() {
    requestAnimationFrame(animate);
    
    // Обновляем анимации если они есть
    if (mixer) {
        mixer.update(0.016); // 60 FPS
    }
    
    renderer.render(scene, camera);
}

// Обновление статуса
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Запуск при загрузке страницы
window.addEventListener('load', init);

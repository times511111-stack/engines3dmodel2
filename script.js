// Основные переменные
let scene, camera, renderer, model, mixer;
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Инициализация сцены
function init() {
    // Создаем сцену
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Создаем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);
    
    // Создаем рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    
    // Добавляем освещение
    addLighting();
    
    // Загружаем модель
    loadModel();
    
    // Запускаем анимацию
    animate();
    
    // Обработчики событий
    setupEventListeners();
}

// Добавление освещения
function addLighting() {
    // Основной свет
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Направленный свет
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Задний свет
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, 0, -5);
    scene.add(backLight);
}

// Загрузка модели
function loadModel() {
    // Проверяем, доступен ли GLTFLoader
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader не загружен!');
        createTestModel();
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    // Пытаемся загрузить модель
    loader.load(
        'engine3dmodel.glb?v=' + Date.now(),
        
        // Успешная загрузка
        function(gltf) {
            console.log("✅ Модель успешно загружена!");
            document.getElementById('loading').style.display = 'none';
            
            model = gltf.scene;
            scene.add(model);
            setupModel();
            
            // Запускаем анимации если есть
            if (gltf.animations && gltf.animations.length > 0) {
                console.log("🎬 Найдено анимаций:", gltf.animations.length);
                setupAnimations(gltf.animations);
            }
        },
        
        // Прогресс загрузки
        function(progress) {
            const percent = (progress.loaded / progress.total * 100) || 0;
            document.getElementById('loading').innerHTML = 
                `⏳ Загрузка 3D модели... ${percent.toFixed(1)}%`;
        },
        
        // Ошибка загрузки
        function(error) {
            console.error("❌ Ошибка загрузки модели:", error);
            createTestModel();
            document.getElementById('loading').innerHTML = 
                "⚠️ Модель не найдена. Показан тестовый двигатель";
            
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 3000);
        }
    );
}

// Настройка модели
function setupModel() {
    if (!model) return;
    
    // Центрируем модель
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;
    
    // Настройка камеры
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    cameraZ *= 1.5;
    
    camera.position.z = cameraZ;
    
    // Включаем тени
    model.traverse(function(child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}

// Настройка анимаций
function setupAnimations(animations) {
    mixer = new THREE.AnimationMixer(model);
    
    animations.forEach((clip) => {
        console.log("Запускаем анимацию:", clip.name);
        mixer.clipAction(clip).play();
    });
}

// Создание тестовой модели
function createTestModel() {
    const group = new THREE.Group();
    
    // Основа двигателя
    const engineGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
    const engineMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        shininess: 30 
    });
    const engine = new THREE.Mesh(engineGeometry, engineMaterial);
    engine.castShadow = true;
    group.add(engine);
    
    // Поршни (4 штуки)
    const pistonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 12);
    const pistonMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff4444 
    });
    
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const piston = new THREE.Mesh(pistonGeometry, pistonMaterial);
        piston.position.x = Math.cos(angle) * 1.2;
        piston.position.z = Math.sin(angle) * 1.2;
        piston.position.y = 0.5;
        piston.castShadow = true;
        group.add(piston);
    }
    
    // Коленвал
    const crankshaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 12);
    const crankshaftMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffff00 
    });
    const crankshaft = new THREE.Mesh(crankshaftGeometry, crankshaftMaterial);
    crankshaft.rotation.z = Math.PI / 2;
    crankshaft.castShadow = true;
    group.add(crankshaft);
    
    scene.add(group);
    model = group;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Вращение мышкой
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    
    // Приближение колесиком мыши
    renderer.domElement.addEventListener('wheel', onMouseWheel);
    
    // Изменение размера окна
    window.addEventListener('resize', onWindowResize);
}

// Обработчики мыши
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
    
    // Ограничение вращения
    model.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, model.rotation.x));
    
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onMouseWheel(event) {
    // Приближение/отдаление
    camera.position.z += event.deltaY * 0.01;
    camera.position.z = Math.max(1, Math.min(20, camera.position.z));
}

// Изменение размера окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Анимационный цикл
function animate() {
    requestAnimationFrame(animate);
    
    // Обновляем анимации если есть
    if (mixer) {
        mixer.update(0.016);
    }
    
    // Анимация тестовой модели
    if (model && !mixer) {
        model.rotation.y += 0.005;
        
        // Анимируем поршни если это тестовая модель
        if (model.children.length > 4) {
            for (let i = 1; i <= 4; i++) {
                const piston = model.children[i];
                piston.position.y = 0.5 + Math.sin(Date.now() * 0.005 + i) * 0.3;
            }
        }
    }
    
    renderer.render(scene, camera);
}

// Запуск приложения когда страница загружена
window.addEventListener('load', init);

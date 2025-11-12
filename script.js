const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Добавим свет, чтобы видеть модель (если она не имеет собственных материалов с излучанием)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

// Добавим обработчики для отладки
loader.load(
    'engine3dmodel.glb', // убедитесь, что это правильное имя файла
    function (gltf) {
        console.log("Модель загружена успешно!");
        scene.add(gltf.scene);
        
        // Если есть анимации, запускаем их
        if (gltf.animations && gltf.animations.length) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            gltf.animations.forEach(animation => {
                mixer.clipAction(animation).play();
            });
            // Обновляем анимацию в цикле
            function animate() {
                requestAnimationFrame(animate);
                mixer.update(0.016); // время между кадрами
                renderer.render(scene, camera);
            }
            animate();
        } else {
            // Если анимаций нет, просто вращаем модель
            function animate() {
                requestAnimationFrame(animate);
                gltf.scene.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% загружено');
    },
    function (error) {
        console.error('Ошибка загрузки модели', error);
    }
);

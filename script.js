// Простая сцена для 3D модели
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Загрузка модели
const loader = new THREE.GLTFLoader();
loader.load('engine3dmodel.glb', function (gltf) {
    scene.add(gltf.scene);

    // Автоматическое воспроизведение анимации
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    function animate() {
        requestAnimationFrame(animate);
        mixer.update(0.016); // Обновление анимации
        renderer.render(scene, camera);
    }
    animate();
});

camera.position.z = 5;
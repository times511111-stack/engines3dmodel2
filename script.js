// Ïðîñòàÿ ñöåíà äëÿ 3D ìîäåëè
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Çàãðóçêà ìîäåëè
const loader = new THREE.GLTFLoader();
loader.load('cube.glb', function (gltf) {
    scene.add(gltf.scene);

    // Àâòîìàòè÷åñêîå âîñïðîèçâåäåíèå àíèìàöèè
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });

    function animate() {
        requestAnimationFrame(animate);
        mixer.update(0.016); // Îáíîâëåíèå àíèìàöèè
        renderer.render(scene, camera);
    }
    animate();
});


camera.position.z = 5;

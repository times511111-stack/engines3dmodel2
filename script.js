loader.load('engine3dmodel.glb', function(gltf) {
    console.log("✅ Модель загружена!");
    model = gltf.scene;
    scene.add(model);
    
    // ДИАГНОСТИКА: выводим ВСЕ объекты модели
    console.log("=== СТРУКТУРА МОДЕЛИ ===");
    model.traverse((child) => {
        if (child.isMesh) {
            console.log(`Объект: ${child.name}`);
        }
    });
    
    // Остальной код без изменений...
    const mixer = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
        console.log("Найдено анимаций:", gltf.animations.length);
        gltf.animations.forEach((clip, index) => {
            console.log(`Анимация ${index}: ${clip.name}`);
            mixer.clipAction(clip).play();
        });
        
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
}, function(progress) {
    console.log("📊 Загружено:", progress.loaded);
}, function(error) {
    console.error("❌ Ошибка загрузки:", error);
});

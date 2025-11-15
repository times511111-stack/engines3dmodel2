<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Двигатель</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background: #1a1a2e;
            font-family: Arial, sans-serif;
        }
        canvas { 
            display: block; 
            cursor: grab;
        }
        canvas:active {
            cursor: grabbing;
        }
        .info {
            position: absolute;
            top: 10px;
            left: 10px;
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 100;
        }
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 18px;
            background: rgba(0,0,0,0.8);
            padding: 20px;
            border-radius: 10px;
            z-index: 100;
        }
    </style>
</head>
<body>
    <div class="info">
        🖱️ Зажмите левую кнопку мыши для вращения<br>
        🔍 Колесико мыши для приближения
    </div>
    
    <div class="loading" id="loading">
        ⏳ Загрузка 3D модели...
    </div>

    <!-- Подключаем Three.js и необходимые модули -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <!-- ВАЖНО: Подключаем GLTFLoader -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="script.js"></script>
</body>
</html>

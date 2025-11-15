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
            background: #000000;
            font-family: Arial, sans-serif;
        }
        canvas { 
            display: block; 
            cursor: grab;
        }
        #status {
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
    </style>
</head>
<body>
    <div id="status">🔄 Загрузка...</div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <script src="script.js"></script>
</body>
</html>

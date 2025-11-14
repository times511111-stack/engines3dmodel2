// === НАЧАЛО ФАЙЛА ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === ПЕРЕМЕННЫЕ ДЛЯ МЫШКИ ===
let isMouseDown = false;
let previousMouseX = 0;
let previousMouseY = 0;
let model = null;

// === ОСВЕЩЕНИЕ ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);

// === ЗАГРУЗЧИК МОДЕЛИ ===
const loader = new THREE.GLTFLoader();

// === ЗАГРУЗКА МОДЕЛИ ===
loader.load('engine3dmodel.glb', function(gltf) {
    console.log

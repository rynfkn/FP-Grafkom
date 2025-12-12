// js/main.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { createRoom } from "./room.js";
import { createPedestalTable } from './furniture.js';
import { createBench } from './furniture.js';

// --------------------------------------------------
// Scene Setup
// --------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 100
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Lights
// --------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 4);
dir.castShadow = true;
scene.add(dir);

// --------------------------------------------------
// Controls
// --------------------------------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --------------------------------------------------
// Create Room + Furniture
// --------------------------------------------------
createRoom(scene);

const table1 = createPedestalTable();
table1.scale.set(1.3, 1.3, 1.3);
table1.position.set(0, 0, -8);
scene.add(table1);

const table2 = createPedestalTable();
table2.scale.set(1.3, 1.3, 1.3);
table2.position.set(-3.5, 0, -8);
scene.add(table2);

const table3 = createPedestalTable();
table3.scale.set(1.3, 1.3, 1.3);
table3.position.set(3.5, 0, -8);
scene.add(table3);

const table4 = createPedestalTable();
table4.scale.set(1.3, 1.3, 1.3);
table4.position.set(8, 0, 1.5);
scene.add(table4);

const table5 = createPedestalTable();
table5.scale.set(1.3, 1.3, 1.3);
table5.position.set(8, 0, 5);
scene.add(table5);

const table6 = createPedestalTable();
table6.scale.set(1.3, 1.3, 1.3);
table6.position.set(8, 0, -2);
scene.add(table6);

const bench1 = createBench();
bench1.position.set(-5.5, 0, -7.5);
bench1.scale.set(1.3, 1.3, 1.3);
bench1.rotation.y = Math.PI / 2;
scene.add(bench1);

const bench2 = createBench();
bench2.position.set(-2.5, 0, -6);
bench2.scale.set(1.3, 1.3, 1.3);
scene.add(bench2);

const bench3 = createBench();
bench3.position.set(2.5, 0, -6);
bench3.scale.set(1.3, 1.3, 1.3);
scene.add(bench3);

const bench4 = createBench();
bench4.position.set(6, 0, 0.5);
bench4.rotation.y = Math.PI / 2;
bench4.scale.set(1.3, 1.3, 1.3);
scene.add(bench4);

const bench5 = createBench();
bench5.position.set(6, 0, 5);
bench5.rotation.y = Math.PI / 2;
bench5.scale.set(1.3, 1.3, 1.3);
scene.add(bench5);

const bench6 = createBench();
bench6.position.set(7.5, 0, -3.2);
bench6.scale.set(1.3, 1.3, 1.3);
scene.add(bench6);

const bench7 = createBench();
bench7.position.set(6.7, 0, -4.6);
bench7.scale.set(1.3, 1.3, 1.3);
scene.add(bench7);

// --------------------------------------------------
// Load Vending Machine
// --------------------------------------------------
const loader = new GLTFLoader();

loader.load(
  'models/vending-machine/scene.gltf',
  function (gltf) {
    const vendingMachine = gltf.scene;

    const scaleFactor = 2.5; 
    vendingMachine.scale.set(scaleFactor, scaleFactor, scaleFactor);
    vendingMachine.updateMatrixWorld(); 
    
    const box = new THREE.Box3().setFromObject(vendingMachine);
    const size = box.getSize(new THREE.Vector3());

    const yOffset = -box.min.y;
    vendingMachine.position.set(8, yOffset, -8);
    vendingMachine.rotation.y = Math.PI; 

    vendingMachine.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(vendingMachine);
    console.log('Vending machine loaded. Height is:', size.y);
  },
  function (error) {
    console.error('Error loading vending machine:', error);
  }
);

// --------------------------------------------------
// Resize
// --------------------------------------------------
window.addEventListener("resize", () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// --------------------------------------------------
// Loop
// --------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

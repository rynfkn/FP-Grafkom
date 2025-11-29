// js/main.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

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
camera.position.set(6, 5, 10);

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
// Create Room + Dummy Furniture
// --------------------------------------------------
createRoom(scene);

const myTable = createPedestalTable();
myTable.position.set(0, 0, 0); // Atur posisi jika perlu
scene.add(myTable);

const myBench = createBench();
myBench.position.set(0, 0, 1.9); // Atur posisi jika perlu
scene.add(myBench);

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

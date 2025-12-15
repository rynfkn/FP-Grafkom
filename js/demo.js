import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"; // Pastikan path ini sesuai environment Anda

import { createRoom } from "./room.js";
import { createPedestalTable } from "./furniture.js";
import { createBench } from "./furniture.js";
import { createWallMagazine } from "./furniture.js";
import { createTV } from "./furniture.js";
import { createCoffeeMachine } from "./coffeeMachine.js";
import { loadVendingMachine } from "./loader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(2, 3, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Aktifkan bayangan
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Gerakan halus
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0); // Titik fokus kamera

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-5, 10, 5);
dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -15;
dirLight.shadow.camera.right = 15;
dirLight.shadow.camera.top = 15;
dirLight.shadow.camera.bottom = -15;
scene.add(dirLight);

// Room
// createRoom(scene);

// Table
// const table1 = createPedestalTable({
// //   topColor: 0xf3f2ed,
// });
// table1.scale.set(1.3, 1.3, 1.3);
// table1.position.set(0, 0, 0);
// scene.add(table1);

// Bench
// const bench1 = createBench();
// bench1.position.set(0, 0, 0);
// bench1.scale.set(1.3, 1.3, 1.3);
// bench1.rotation.y = Math.PI / 2;
// scene.add(bench1);

// Wall Magazine
// const Magazine = createWallMagazine({
//   posters: [
//     {
//       url: "assets/Poster Satria Data.jpg",
//       x: -1.5,
//       y: -0.1,
//       w: 0.6,
//       h: 0.8,
//     },
//     {
//       url: "assets/Poster Gemastik.png",
//       x: -0.5,
//       y: -0.1,
//       w: 0.6,
//       h: 0.8,
//     },
//     {
//       url: "assets/Poster Gemastik.png",
//       x: 0.5,
//       y: -0.1,
//       w: 0.6,
//       h: 0.8,
//     },
//     {
//       url: "assets/Poster Gemastik.png",
//       x: 1.5,
//       y: -0.1,
//       w: 0.6,
//       h: 0.8,
//     },
//   ],
// });
// Magazine.scale.set(1.8, 1.8, 1.8);
// Magazine.position.set(0, 0, 0);
// scene.add(Magazine);

// TV
// const TV = createTV();
// TV.position.set(0, 0, 0);
// TV.scale.set(1.5, 1.5, 1.5);
// scene.add(TV);

// Vending Machine
// loadVendingMachine(scene);

// Coffee Machine
// const coffeeMachine = createCoffeeMachine();
// coffeeMachine.scale.set(0.5, 0.5, 0.5);
// coffeeMachine.position.set(0, 0, 0);
// coffeeMachine.rotation.y = -(Math.PI / 2);
// scene.add(coffeeMachine);

const clock = new THREE.Clock();

window.addEventListener("resize", () => {
  const w = window.innerWidth,
    h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();

// js/main.js
import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

import { createRoom } from "./room.js";
import { createPedestalTable } from "./furniture.js";
import { createBench } from "./furniture.js";
import { createWallMagazine } from "./furniture.js";
import { createTV } from "./furniture.js";
import { createCoffeeMachine } from "./coffeeMachine.js";

import { loadVendingMachine } from "./loader.js";

// --------------------------------------------------
// Scene Setup
// --------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Lights
// --------------------------------------------------
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(-5, 25, -15);
dir.castShadow = true;
dir.shadow.mapSize.width = 2048;
dir.shadow.mapSize.height = 2048;

const d = 25;
dir.shadow.camera.left = -d;
dir.shadow.camera.right = d;
dir.shadow.camera.top = d;
dir.shadow.camera.bottom = -d;
dir.shadow.bias = -0.0001;
dir.shadow.normalBias = 0.05;

scene.add(dir);

// --------------------------------------------------
// Controls
// --------------------------------------------------
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.lookSpeed = 0.1;
controls.movementSpeed = 5;

// --------------------------------------------------
// Create Room + Furniture
// --------------------------------------------------
createRoom(scene);

const table1 = createPedestalTable({
  topColor: 0xf3f2ed,
});
table1.scale.set(1.3, 1.3, 1.3);
table1.position.set(0, 0, -8);
scene.add(table1);

const table2 = createPedestalTable({
  topColor: 0xf3f2ed,
});
table2.scale.set(1.3, 1.3, 1.3);
table2.position.set(-3.5, 0, -8);
scene.add(table2);

const table3 = createPedestalTable();
table3.scale.set(1.3, 1.3, 1.3);
table3.position.set(3.5, 0, -8);
scene.add(table3);

const table4 = createPedestalTable({
  topColor: 0xf3f2ed,
});
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

const table7 = createPedestalTable();
table7.scale.set(1.3, 1.3, 1.3);
table7.position.set(-2, 0, 13.8);
table7.rotation.y = -10 * (Math.PI / 180);
scene.add(table7);

const table8 = createPedestalTable();
table8.scale.set(1.3, 1.3, 1.3);
table8.position.set(-5.5, 0, 13.18);
table8.rotation.y = -10 * (Math.PI / 180);
scene.add(table8);

const table9 = createPedestalTable();
table9.scale.set(1.3, 1.3, 1.3);
table9.position.set(1.5, 0, 14.46);
table9.rotation.y = -10 * (Math.PI / 180);
scene.add(table9);

const table10 = createPedestalTable();
table10.scale.set(1.3, 1.3, 1.3);
table10.position.set(-1.3, 0, 10);
table10.rotation.y = -10 * (Math.PI / 180);
scene.add(table10);

const table11 = createPedestalTable();
table11.scale.set(1.3, 1.3, 1.3);
table11.position.set(-4.8, 0, 9.4);
table11.rotation.y = -10 * (Math.PI / 180);
scene.add(table11);

const table12 = createPedestalTable();
table12.scale.set(1.3, 1.3, 1.3);
table12.position.set(2.3, 0, 10.6);
table12.rotation.y = -10 * (Math.PI / 180);
scene.add(table12);

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

const bench8 = createBench();
bench8.position.set(0, 0, 16.5);
bench8.rotation.y = -10 * (Math.PI / 180);
bench8.scale.set(1.3, 1.3, 1.3);
scene.add(bench8);

const bench9 = createBench();
bench9.position.set(-4.5, 0, 15.7);
bench9.rotation.y = -10 * (Math.PI / 180);
bench9.scale.set(1.3, 1.3, 1.3);
scene.add(bench9);

const bench10 = createBench();
bench10.position.set(-7.5, 0, 13.5);
bench10.rotation.y = Math.PI / 2 - 10 * (Math.PI / 180);
bench10.scale.set(1.3, 1.3, 1.3);
scene.add(bench10);

const bench11 = createBench();
bench11.position.set(3.5, 0, 15.5);
bench11.rotation.y = Math.PI / 2 - 10 * (Math.PI / 180);
bench11.scale.set(1.3, 1.3, 1.3);
scene.add(bench11);

const bench12 = createBench();
bench12.position.set(1.5, 0, 8.5);
bench12.rotation.y = -10 * (Math.PI / 180);
bench12.scale.set(1.3, 1.3, 1.3);
scene.add(bench12);

const bench13 = createBench();
bench13.position.set(-3, 0, 7.7);
bench13.rotation.y = -10 * (Math.PI / 180);
bench13.scale.set(1.3, 1.3, 1.3);
scene.add(bench13);

const bench14 = createBench();
bench14.position.set(-7, 0, 8.7);
bench14.rotation.y = Math.PI / 2 - 10 * (Math.PI / 180);
bench14.scale.set(1.3, 1.3, 1.3);
scene.add(bench14);

// --------------------------------------------------
// Wall Magazine
// --------------------------------------------------
const Magazine = createWallMagazine({
  posters: [
    {
      url: "assets/Poster Satria Data.jpg",
      x: -1.5, 
      y: -0.1, 
      w: 0.6, // Lebar poster
      h: 0.8, // Tinggi poster
    },
    {
      url: "assets/Poster Gemastik.png",
      x: -0.5, 
      y: -0.1, 
      w: 0.6, // Lebar poster
      h: 0.8, // Tinggi poster
    },
    {
      url: "assets/Poster Gemastik.png",
      x: 0.5, 
      y: -0.1, 
      w: 0.6, // Lebar poster
      h: 0.8, // Tinggi poster
    },
    {
      url: "assets/Poster Gemastik.png",
      x: 1.5, 
      y: -0.1, 
      w: 0.6, // Lebar poster
      h: 0.8, // Tinggi poster
    },
  ],
});
Magazine.scale.set(1.8, 1.8, 1.8);
Magazine.position.set(-1.6, 4.5, 12.3);
Magazine.rotation.y = -10 * (Math.PI / 180);
scene.add(Magazine);

// --------------------------------------------------
// TV
// --------------------------------------------------
const TV = createTV();
TV.position.set(-1.5, 4.5, 11.75);
TV.rotation.y = Math.PI - (10 * Math.PI) / 180;
TV.scale.set(1.5, 1.5, 1.5);
scene.add(TV);

// --------------------------------------------------
// Load Vending Machine
// --------------------------------------------------
loadVendingMachine(scene);

// --------------------------------------------------
// Coffee Machine
// --------------------------------------------------
const coffeeMachine = createCoffeeMachine();
coffeeMachine.scale.set(0.5, 0.5, 0.5);
coffeeMachine.position.set(8.25, 0, 8);
coffeeMachine.rotation.y = -(Math.PI / 2);
scene.add(coffeeMachine);

// --------------------------------------------------
// Resize
// --------------------------------------------------
window.addEventListener("resize", () => {
  const w = window.innerWidth,
    h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  controls.handleResize();
});

// --------------------------------------------------
// Loop
// --------------------------------------------------
function animate() {
  requestAnimationFrame(animate);
  controls.update(clock.getDelta());
  renderer.render(scene, camera);
}
animate();

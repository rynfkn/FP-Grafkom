// js/room.js
import * as THREE from "three";

/**
 * Membuat tekstur prosedural sederhana untuk lantai ubin
 * agar kita tidak perlu meload gambar eksternal (jpg/png) saat ini.
 */
function createTileTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  // Warna dasar (Grout/Semen)
  context.fillStyle = "#6e4c35"; 
  context.fillRect(0, 0, 512, 512);

  // Warna Ubin (Terracotta)
  context.fillStyle = "#8b5a2b"; 
  
  // Gambar kotak-kotak ubin (misal 4x4 ubin di texture ini)
  const tileSize = 120; // ukuran ubin
  const gap = 8; // celah semen
  
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
        context.fillRect(
            x * (tileSize + gap) + gap/2, 
            y * (tileSize + gap) + gap/2, 
            tileSize, 
            tileSize
        );
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4); // Ulangi tekstur di lantai yang luas
  return texture;
}

export function createRoom(scene) {
  // --- 1. Lantai Ubin ---
  const tileTexture = createTileTexture();
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: tileTexture,
    roughness: 0.8,
  });

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(20, 0.2, 20), // Pakai Box biar lantai punya ketebalan dikit
    floorMaterial
  );
  floor.position.y = -0.1; // Turunkan sedikit agar y=0 adalah permukaan lantai
  floor.receiveShadow = true;
  scene.add(floor);

  // --- 2. Material Dinding ---
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f2f0, // Putih tulang
    roughness: 0.5,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x88ccee,
    metalness: 0,
    roughness: 0,
    transmission: 0.9, // Kaca bening
    thickness: 0.5,
    transparent: true,
    opacity: 0.3
  });

  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Aluminium gelap

  // --- 3. Dinding Belakang (Dengan Jendela) ---
  // Kita bangun dinding ini dari balok-balok terpisah agar ada lubang jendelanya
  
  const wallGroup = new THREE.Group();
  
  // Bagian Bawah Jendela (Dwarf wall)
  const bottomWall = new THREE.Mesh(new THREE.BoxGeometry(20, 2, 0.5), wallMaterial);
  bottomWall.position.set(0, 1, -10);
  bottomWall.castShadow = true;
  bottomWall.receiveShadow = true;
  wallGroup.add(bottomWall);

  // Bagian Atas Jendela (Header)
  const topWall = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 0.5), wallMaterial);
  topWall.position.set(0, 5.5, -10); // Tinggi total dinding misal 6m
  topWall.castShadow = true;
  wallGroup.add(topWall);

  // Tiang-tiang pemisah jendela (Vertical Columns)
  // Kita buat 3 tiang vertikal agar jendela terbagi
  for(let x of [-9.5, -3, 3, 9.5]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 0.5), wallMaterial);
      pillar.position.set(x, 3.5, -10);
      pillar.castShadow = true;
      wallGroup.add(pillar);
  }

  // Kaca Jendela (Window Panes)
  // Isi celah dengan kaca
  const glass = new THREE.Mesh(new THREE.BoxGeometry(18, 3.5, 0.1), glassMaterial);
  glass.position.set(0, 3.5, -10);
  wallGroup.add(glass);

  // Bingkai Jendela (Frame Garis Horizontal)
  const frameBar = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 0.6), frameMaterial);
  frameBar.position.set(0, 3.5, -10); // Garis tengah jendela
  wallGroup.add(frameBar);

  scene.add(wallGroup);

  // --- 4. Dinding Samping (Solid) ---
  // Kiri
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 20), wallMaterial);
  leftWall.position.set(-10, 3, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Kanan
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 20), wallMaterial);
  rightWall.position.set(10, 3, 0);
  rightWall.receiveShadow = true;
  scene.add(rightWall);
}
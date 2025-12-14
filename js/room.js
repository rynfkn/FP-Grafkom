import * as THREE from "three";

// --- 1. FLOOR (LANTAI) ---

function createTileTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  // Warna Grout (Semen - Gelap)
  context.fillStyle = "#4a3c31";
  context.fillRect(0, 0, 512, 512);

  const tileSize = 60; 
  const gap = 4;       

  const tilesAcross = 512 / (tileSize + gap);
  
  for (let y = 0; y < tilesAcross; y++) {
    for (let x = 0; x < tilesAcross; x++) {
      const variance = (Math.random() - 0.5) * 10;
      const r = 192 + variance;
      const g = 122 + variance;
      const b = 85 + variance;
      context.fillStyle = `rgb(${r},${g},${b})`;

      context.fillRect(
        x * (tileSize + gap) + gap / 2,
        y * (tileSize + gap) + gap / 2,
        tileSize,
        tileSize
      );
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4); 
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFloor(width, depth) {
  const tileTexture = createTileTexture();
  const material = new THREE.MeshStandardMaterial({
    map: tileTexture,
    roughness: 0.8,
  });

  const geometry = new THREE.BoxGeometry(width, 0.5, depth);
  const floor = new THREE.Mesh(geometry, material);
  floor.position.y = -0.25; 
  floor.receiveShadow = true;
  return floor;
}

// --- 2. WALLS & WINDOWS HELPER ---

/**
 * Membuat Dinding (Solid atau dengan Lubang Jendela)
 * Mengembalikan THREE.Group yang titik pivotnya ada di dasar dinding (y=0).
 */
export function createWall(width, height, thickness = 0.4, windowConfig = []) {
  const wallGroup = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xfdf5e6, roughness: 0.6 });

  // Jika tidak ada jendela, dinding solid sederhana
  if (!windowConfig || windowConfig.length === 0) {
    const solidWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), material);
    solidWall.position.y = height / 2;
    solidWall.castShadow = true;
    solidWall.receiveShadow = true;
    wallGroup.add(solidWall);
    return wallGroup;
  }

  // --- LOGIKA DINAMIS UNTUK MENGHINDARI GAP ---
  // Kita hitung tinggi dinding bawah & atas berdasarkan konfigurasi jendela pertama.
  // Asumsinya semua jendela dalam satu dinding memiliki ketinggian vertikal yang sama (sejajar).
  
  let bottomHeight = 1.5; // Default jika error
  let topHeight = 1.0;    // Default jika error

  if (windowConfig.length > 0) {
    const win = windowConfig[0];
    const winBottomY = win.y - (win.height / 2);
    const winTopY = win.y + (win.height / 2);

    // Dinding bawah setinggi bagian bawah jendela
    bottomHeight = winBottomY;
    // Dinding atas adalah sisa dari tinggi total dikurangi bagian atas jendela
    topHeight = height - winTopY;

    // Safety check agar tidak negatif
    if (bottomHeight < 0) bottomHeight = 0;
    if (topHeight < 0) topHeight = 0;
  }

  const windowAreaHeight = height - bottomHeight - topHeight;

  // 1. Dinding Bawah
  if (bottomHeight > 0.01) {
    const bottomWall = new THREE.Mesh(new THREE.BoxGeometry(width, bottomHeight, thickness), material);
    bottomWall.position.y = bottomHeight / 2;
    bottomWall.castShadow = true;
    bottomWall.receiveShadow = true;
    wallGroup.add(bottomWall);
  }

  // 2. Dinding Atas
  if (topHeight > 0.01) {
    const topWall = new THREE.Mesh(new THREE.BoxGeometry(width, topHeight, thickness), material);
    topWall.position.y = height - topHeight / 2;
    topWall.castShadow = true;
    topWall.receiveShadow = true;
    wallGroup.add(topWall);
  }

  // 3. Pilar di antara jendela
  let currentX = -width / 2;
  const sortedWindows = [...windowConfig].sort((a, b) => a.x - b.x);

  sortedWindows.forEach((win) => {
    const gapWidth = (win.x - win.width/2) - currentX;
    if (gapWidth > 0.01) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(gapWidth, windowAreaHeight, thickness), material);
      pillar.position.set(currentX + gapWidth/2, bottomHeight + windowAreaHeight/2, 0);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      wallGroup.add(pillar);
    }
    currentX = win.x + win.width/2;
  });

  // Pilar penutup di kanan
  const remainingWidth = (width / 2) - currentX;
  if (remainingWidth > 0.01) {
    const endPillar = new THREE.Mesh(new THREE.BoxGeometry(remainingWidth, windowAreaHeight, thickness), material);
    endPillar.position.set(currentX + remainingWidth/2, bottomHeight + windowAreaHeight/2, 0);
    endPillar.castShadow = true;
    endPillar.receiveShadow = true;
    wallGroup.add(endPillar);
  }

  return wallGroup;
}

/**
 * Membuat Bingkai Jendela dan Kaca
 */
export function createWindows(windowConfig, wallThickness = 0.4) {
  const group = new THREE.Group();
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }); // Frame Putih
  const glassMat = new THREE.MeshPhysicalMaterial({
    metalness: 0.1,
    roughness: 0,
    transmission: 0.6,
    transparent: true,
    opacity: 0.5
  });

  windowConfig.forEach(win => {
    // Dimensi Frame
    const frameW = 0.12; // Lebar frame sekeliling
    const frameD = wallThickness + 0.06; // Depth: sedikit menonjol dari dinding

    // --- 1. Frame Luar ---
    
    // Atas
    const top = new THREE.Mesh(new THREE.BoxGeometry(win.width, frameW, frameD), frameMat);
    top.position.set(win.x, win.y + win.height/2 - frameW/2, 0);
    top.castShadow = true;
    group.add(top);

    // Bawah (Sill / Ambang - Sedikit lebih tebal depth-nya)
    const sillDepth = frameD + 0.05; 
    const bottom = new THREE.Mesh(new THREE.BoxGeometry(win.width, frameW, sillDepth), frameMat);
    bottom.position.set(win.x, win.y - win.height/2 + frameW/2, 0);
    bottom.castShadow = true;
    bottom.receiveShadow = true;
    group.add(bottom);

    // Kiri & Kanan (Tingginya dikurangi frame atas/bawah)
    const sideH = win.height - frameW * 2;
    
    const left = new THREE.Mesh(new THREE.BoxGeometry(frameW, sideH, frameD), frameMat);
    left.position.set(win.x - win.width/2 + frameW/2, win.y, 0);
    left.castShadow = true;
    group.add(left);

    const right = new THREE.Mesh(new THREE.BoxGeometry(frameW, sideH, frameD), frameMat);
    right.position.set(win.x + win.width/2 - frameW/2, win.y, 0);
    right.castShadow = true;
    group.add(right);

    // --- 2. Palang Tengah (Grid +) ---
    const barThick = 0.06; // Lebih tipis dari frame utama
    const barDepth = frameD - 0.05; // Sedikit lebih tipis depth-nya (inset)

    // Horizontal
    const hMid = new THREE.Mesh(new THREE.BoxGeometry(win.width - frameW*2, barThick, barDepth), frameMat);
    hMid.position.set(win.x, win.y, 0);
    group.add(hMid);
    
    // Vertikal
    const vMid = new THREE.Mesh(new THREE.BoxGeometry(barThick, sideH, barDepth), frameMat);
    vMid.position.set(win.x, win.y, 0);
    group.add(vMid);

    // --- 3. Kaca ---
    // Pastikan kaca mengisi penuh area dalam frame
    const glass = new THREE.Mesh(new THREE.BoxGeometry(win.width - frameW, win.height - frameW, 0.05), glassMat);
    glass.position.set(win.x, win.y, 0);
    group.add(glass);
  });

  return group;
}

export function createRoom(scene) {
  // --- A. LANTAI ---
  const floorSize_X = 22;
  const floorSize_Z = 30;
  const floor = createFloor(floorSize_X, floorSize_Z);
  floor.position.set(-0.5, -0.25, 4.5);
  scene.add(floor);

  const wallHeight = 7;
  const wallThickness = 0.5;

  const winConfigFront = [
    { x: -3.5, width: 4, height: 4, y: 4 }, 
    { x: 1, width: 4, height: 4, y: 4 }   
  ];

  const frontGroup = new THREE.Group();
  
  const frontWall = createWall(17, wallHeight, wallThickness, winConfigFront);
  frontWall.position.set(1.75, 0, 0); 
  frontGroup.add(frontWall);

  const frontWindows = createWindows(winConfigFront, wallThickness);
  frontWindows.position.set(1.75, 0, 0); 
  frontGroup.add(frontWindows);

  // Posisikan Group di Z = -10
  frontGroup.position.set(0, 0, -10);
  scene.add(frontGroup);


  // --- C. DINDING KANAN (Right Wall - X axis positif +10) ---
  const winConfigRight = [
    { x: -5.5, width: 4, height: 4, y: 4 },
    { x: -1, width: 4, height: 4, y: 4 },
    { x: 3.5, width: 4, height: 4, y: 4 },
  ];

  const rightGroup = new THREE.Group();
  
  // Gunakan lebar 20
  const rightWall = createWall(25, wallHeight, wallThickness, winConfigRight);
  rightWall.position.set(2.5, 0, 0);
  rightGroup.add(rightWall);

  const rightWindows = createWindows(winConfigRight, wallThickness);
  rightWindows.position.set(2.5, 0, 0);
  rightGroup.add(rightWindows);

  // Posisikan di X = 10, rotasi -90 derajat
  rightGroup.position.set(10, 0, 0);
  rightGroup.rotation.y = -Math.PI / 2;
  scene.add(rightGroup);


  // --- D. DINDING KIRI (Solid Left Wall - X axis negatif -10) ---
  const leftGroup = createWall(20, wallHeight, wallThickness);
  leftGroup.position.set(-11, 0, 0);
  leftGroup.rotation.y = Math.PI / 2;
  scene.add(leftGroup);

  // --- E. DINDING BELAKANG (Solid Back Wall - Z axis positif +10) ---
  const backGroup = createWall(14, wallHeight, wallThickness);
  backGroup.position.set(-1.4, 0, 12);
  backGroup.rotation.y = -10 * (Math.PI / 180);
  scene.add(backGroup);
}
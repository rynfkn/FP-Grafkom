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

// --- 2. CEILING ---

function createLamp() {
  const group = new THREE.Group();

  const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.1 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.9 });
  const bulbMat = new THREE.MeshStandardMaterial({ 
    color: 0x000000, 
    emissive: 0xffffee, 
    emissiveIntensity: 3, 
    roughness: 0.1 
  });

  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 32), blackMat);
  mount.position.y = -0.01;
  group.add(mount);

  const stemLen = 0.15;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, stemLen, 16), blackMat);
  stem.position.y = -0.02 - (stemLen / 2);
  group.add(stem);

  const bodyHeight = 0.35;
  const bodyRadius = 0.14;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32), blackMat);
  const bodyY = stem.position.y - (stemLen / 2) - (bodyHeight / 2);
  body.position.y = bodyY;
  group.add(body);

  const rim = new THREE.Mesh(new THREE.CylinderGeometry(bodyRadius - 0.02, bodyRadius - 0.02, 0.02, 32), chromeMat);
  rim.position.y = bodyY - (bodyHeight / 2) + 0.001;
  group.add(rim);

  const bulb = new THREE.Mesh(new THREE.CircleGeometry(bodyRadius - 0.04, 32), bulbMat);
  bulb.rotation.x = -Math.PI / 2;
  bulb.position.y = bodyY - (bodyHeight / 2) + 0.01;
  group.add(bulb);

  const spotLight = new THREE.SpotLight(0xfff4e5, 15);
  spotLight.position.set(0, bodyY, 0);
  spotLight.target.position.set(0, -10, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.5;
  spotLight.decay = 1;
  spotLight.distance = 25;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.bias = -0.0001;
  group.add(spotLight);
  group.add(spotLight.target);

  return group;
}

function createCeiling() {
  const ceilingGroup = new THREE.Group();

  const whiteCeilingMat = new THREE.MeshStandardMaterial({ color: 0xfdf5e6, roughness: 0.9, side: THREE.DoubleSide });
  const beamMat = new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.8 });

  const minX = -10.25; 
  const maxX = 10.25;
  const frontZ = -9.25; 

  const backRightZ = 14.225;
  const backLeftZ = 10.6;

  const shape = new THREE.Shape();
  shape.moveTo(minX, frontZ);       
  shape.lineTo(maxX, frontZ);       
  shape.lineTo(maxX, backRightZ);   
  shape.lineTo(minX, backLeftZ);    
  shape.lineTo(minX, frontZ);       

  const extrudeSettings = { depth: 0.05, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const ceilingMesh = new THREE.Mesh(geometry, whiteCeilingMat);
  ceilingMesh.rotation.x = Math.PI / 2; 
  ceilingMesh.position.y = 0.625; 
  ceilingMesh.receiveShadow = true;
  ceilingGroup.add(ceilingMesh);

  const beamHeight = 0.6;
  const beamWidth = 0.5;

  const xPositions = [-10, -0.5, 9]; 
  
  xPositions.forEach(posX => {
    const t = (posX - minX) / (maxX - minX); 
    const limitZ = backLeftZ + t * (backRightZ - backLeftZ);
    const length = limitZ - frontZ;
    const centerZ = frontZ + (length / 2);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(beamWidth, beamHeight, length), beamMat);
    beam.position.set(posX, beamHeight/2, centerZ);
    beam.castShadow = true;
    beam.receiveShadow = true;
    ceilingGroup.add(beam);
  });

  const zPositions = [-9, 0, 8]; 

  zPositions.forEach(posZ => {
    const length = maxX - minX;
    const centerX = (maxX + minX) / 2;

    const beam = new THREE.Mesh(new THREE.BoxGeometry(length, beamHeight - 0.02, beamWidth), beamMat);
    beam.position.set(centerX, beamHeight/2 - 0.01, posZ);
    beam.castShadow = true;
    beam.receiveShadow = true;
    ceilingGroup.add(beam);
  });

  const lightX = [-5.25, 4.25];
  const lightZ = [-4.5, 4.0];

  lightX.forEach(lx => {
    lightZ.forEach(lz => {
      const light = createLamp();
      light.position.set(lx, beamHeight, lz);
      ceilingGroup.add(light);
    });
  });

  return ceilingGroup;
}

// --- 3. WALLS & WINDOWS HELPER ---

/**
 * Membuat Dinding (Solid atau dengan Lubang Jendela)
 * Mengembalikan THREE.Group yang titik pivotnya ada di dasar dinding (y=0).
 */
export function createWall(width, height, thickness = 0.4, windowConfig = [], use_skirting = true) {
  const wallGroup = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xfdf5e6, roughness: 0.6 });

  // --- A. MEMBUAT PLINT (SKIRTING BOARD) ---
  // Ini adalah "bagian lantai yang menjadi bagian dinding"
  if (use_skirting) {
    const skirtingHeight = 0.25; // Tinggi plint (misal 25cm)
    const skirtingThickness = thickness + 0.05; // Sedikit lebih tebal dari dinding agar menonjol
    
    // Menggunakan warna gelap (#4a3c31) yang sama dengan semen lantai agar menyatu
    const skirtingMat = new THREE.MeshStandardMaterial({ color: 0x4a3c31, roughness: 0.8 });
    
    const skirting = new THREE.Mesh(
      new THREE.BoxGeometry(width, skirtingHeight, skirtingThickness),
      skirtingMat
    );
    // Posisi y = setengah tinggi plint, karena pivot wallGroup ada di y=0 (lantai)
    skirting.position.y = skirtingHeight / 2;
    skirting.castShadow = true;
    skirting.receiveShadow = true;
    
    // Tambahkan plint ke group dinding
    wallGroup.add(skirting);
  }


  // --- B. LOGIKA DINDING UTAMA ---
  
  // Jika tidak ada jendela, dinding solid sederhana (di atas plint)
  if (!windowConfig || windowConfig.length === 0) {
    // Kita buat dinding penuh, plint akan menumpuk di bawahnya (tidak masalah di 3D sederhana)
    // Atau bisa juga membuat dinding mulai dari atas plint, tapi menumpuk lebih aman untuk mencegah celah.
    const solidWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, thickness), material);
    solidWall.position.y = height / 2;
    solidWall.castShadow = true;
    solidWall.receiveShadow = true;
    wallGroup.add(solidWall);
    return wallGroup;
  }

  // --- C. LOGIKA DINAMIS JENDELA ---
  
  let bottomHeight = 1.5; 
  let topHeight = 1.0;    

  if (windowConfig.length > 0) {
    const win = windowConfig[0];
    const winBottomY = win.y - (win.height / 2);
    const winTopY = win.y + (win.height / 2);

    bottomHeight = winBottomY;
    topHeight = height - winTopY;

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
    const glass = new THREE.Mesh(new THREE.BoxGeometry(win.width - frameW, win.height - frameW, 0.05), glassMat);
    glass.position.set(win.x, win.y, 0);
    group.add(glass);
  });

  return group;
}

export function createRoom(scene) {
  // --- LANTAI ---
  const floorSize_X = 22;
  const floorSize_Z = 30;
  const floor = createFloor(floorSize_X, floorSize_Z);
  floor.position.set(-0.5, -0.25, 4.5);
  scene.add(floor);

  const wallHeight = 8;
  const wallThickness = 0.5;

  const ceiling = createCeiling();
  ceiling.position.set(-0.5, wallHeight - 0.625, -0.5);
  scene.add(ceiling);

  const winConfigFront = [
    { x: -3.5, width: 4, height: 4, y: 4 }, 
    { x: 1, width: 4, height: 4, y: 4 }   
  ];

  // --- DINDING DEPAN
  const frontGroup = new THREE.Group();
  
  const frontWall = createWall(17, wallHeight, wallThickness, winConfigFront);
  frontWall.position.set(1.75, 0, 0); 
  frontGroup.add(frontWall);

  const frontWallTop = createWall(4.5, 2, wallThickness, [], false);
  frontWallTop.position.set(-9, 7, 0); 
  frontWallTop.scale.y = 0.5; 
  frontGroup.add(frontWallTop);

  const frontWindows = createWindows(winConfigFront, wallThickness);
  frontWindows.position.set(1.75, 0, 0); 
  frontGroup.add(frontWindows);

  frontGroup.position.set(0, 0, -10);
  scene.add(frontGroup);


  // --- DINDING KANAN 
  const winConfigRight = [
    { x: -5.5, width: 4, height: 4, y: 4 },
    { x: -1, width: 4, height: 4, y: 4 },
    { x: 3.5, width: 4, height: 4, y: 4 },
  ];

  const rightGroup = new THREE.Group();
  
  const rightWall = createWall(25, wallHeight, wallThickness, winConfigRight);
  rightWall.position.set(2.5, 0, 0);
  rightGroup.add(rightWall);

  const rightWindows = createWindows(winConfigRight, wallThickness);
  rightWindows.position.set(2.5, 0, 0);
  rightGroup.add(rightWindows);

  rightGroup.position.set(10, 0, 0);
  rightGroup.rotation.y = -Math.PI / 2;
  scene.add(rightGroup);


  // --- DINDING KIRI 
  const leftGroup = createWall(21, wallHeight, wallThickness);
  leftGroup.position.set(-11, 0, 0.25);
  leftGroup.rotation.y = Math.PI / 2;
  scene.add(leftGroup);

  // --- DINDING BELAKANG
  const backGroup = createWall(14, wallHeight, wallThickness);
  backGroup.position.set(-1.4, 0, 12);
  backGroup.rotation.y = -10 * (Math.PI / 180);
  scene.add(backGroup);

  const rightbackWallTop = createWall(5, 1, wallThickness, [], false);
  rightbackWallTop.position.set(7.5, 7.5, 13.57);
  rightbackWallTop.rotation.y = -10 * (Math.PI / 180);
  rightbackWallTop.scale.y = 0.5;
  scene.add(rightbackWallTop);
  
  const leftbackWallTop = createWall(3, 1, wallThickness, [], false);
  leftbackWallTop.position.set(-9.49, 7.5, 10.57);
  leftbackWallTop.rotation.y = -10 * (Math.PI / 180);
  leftbackWallTop.scale.y = 0.5;
  scene.add(leftbackWallTop);
}

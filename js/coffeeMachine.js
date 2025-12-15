import * as THREE from "three";
import { SUBTRACTION, Brush, Evaluator } from "three-bvh-csg";

// ============================================================
// CONSTANTS
// ============================================================
const COLORS = {
  yellow: 0xfdb627,
  black: 0x4a4a4a,
  darkBlack: 0x111111,
  white: 0xffffff,
  chrome: 0xeeeeee,
  red: "#ff3333",
};

const MACHINE_CONFIG = {
  boxSize: 5,
  bezelThickness: 0.12,
  wheelRadius: 0.2,
  wheelHeightOffset: 0.4,
};

// ============================================================
// TEXTURE LOADING
// ============================================================
const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
  const texture = textureLoader.load(path);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const textures = {
  screen: loadTexture("assets/logo_jumpstart.jpg"),
  sideImage: loadTexture("assets/side_image_coffee_machine.jpg"),
  signImage: loadTexture("assets/sign_image.jpg"),
};

// ============================================================
// TEXTURE GENERATORS
// ============================================================

/**
 * Creates a canvas-based text texture
 */
function createTextTexture(textLines, width, height, bgColor, textColor) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const scale = 128;
  canvas.width = width * scale;
  canvas.height = height * scale;

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Text styling
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = canvas.width / 35;
  ctx.font = `bold ${fontSize}px "Google Sans", "Open Sans", "Roboto", sans-serif`;

  if ("letterSpacing" in ctx) {
    ctx.letterSpacing = "0px";
  }

  // Draw text lines
  const lineHeight = fontSize * 1.3;
  const totalTextHeight = textLines.length * lineHeight;
  const startY = (canvas.height - totalTextHeight) / 2 + lineHeight / 2;

  textLines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates the left panel texture with "CARA PAKAI" instructions
 */
function createLeftPanelTexture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 1280;

  // Background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title "CARA PAKAI"
  const contentStartY = 150;
  ctx.fillStyle = COLORS.red;
  ctx.textAlign = "center";
  ctx.font = "bold 36px Arial";
  ctx.fillText("CARA", canvas.width / 2, contentStartY);
  ctx.fillText("PAKAI", canvas.width / 2, contentStartY + 40);

  // Step icons (numbered boxes)
  const iconStartY = contentStartY + 100;
  const gap = 200;
  const boxSize = 100;

  for (let i = 0; i < 4; i++) {
    const y = iconStartY + i * gap;

    // Yellow box
    ctx.fillStyle = "#fdb627";
    ctx.fillRect((canvas.width - boxSize) / 2, y, boxSize, boxSize);

    // Number
    ctx.fillStyle = "#000";
    ctx.font = "bold 40px Arial";
    ctx.fillText((i + 1).toString(), canvas.width / 2, y + boxSize / 2 + 15);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates the right panel texture with info icons
 */
function createRightPanelTexture() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 1280;

  // Background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Info icons (circles with cross)
  ctx.strokeStyle = "#fdb627";
  ctx.lineWidth = 6;

  const startY = 300;
  const gap = 200;

  for (let i = 0; i < 3; i++) {
    const y = startY + i * gap;

    // Circle outline
    ctx.beginPath();
    ctx.arc(canvas.width / 2, y, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Cross inside
    ctx.fillStyle = "#fdb627";
    ctx.fillRect(canvas.width / 2 - 25, y - 5, 50, 10);
    ctx.fillRect(canvas.width / 2 - 5, y - 25, 10, 50);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ============================================================
// MATERIALS FACTORY
// ============================================================
const Materials = {
  black: () =>
    new THREE.MeshStandardMaterial({
      color: COLORS.black,
      roughness: 0.3,
      metalness: 0.1,
    }),

  yellow: () =>
    new THREE.MeshStandardMaterial({
      color: COLORS.yellow,
      roughness: 0.4,
    }),

  chrome: () =>
    new THREE.MeshStandardMaterial({
      color: COLORS.chrome,
      metalness: 0.9,
      roughness: 0.1,
    }),

  glass: () =>
    new THREE.MeshStandardMaterial({
      color: COLORS.white,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      side: THREE.DoubleSide,
    }),

  frame: () =>
    new THREE.MeshStandardMaterial({
      color: COLORS.black,
      roughness: 0.5,
      metalness: 0.3,
    }),
};

// ============================================================
// COMPONENT BUILDERS
// ============================================================

/**
 * Creates a framed box with bezel using CSG
 */
function createFramedBox(width, height, depth, bezelThickness) {
  const evaluator = new Evaluator();
  const frameMaterial = Materials.frame();

  // Outer shell
  const outerBrush = new Brush(
    new THREE.BoxGeometry(width, height, depth),
    frameMaterial
  );
  outerBrush.updateMatrixWorld();

  // Cut holes in each axis
  const cuts = [
    {
      w: width + 2,
      h: height - bezelThickness * 2,
      d: depth - bezelThickness * 2,
    },
    {
      w: width - bezelThickness * 2,
      h: height + 2,
      d: depth - bezelThickness * 2,
    },
    {
      w: width - bezelThickness * 2,
      h: height - bezelThickness * 2,
      d: depth + 2,
    },
  ];

  let result = outerBrush;
  cuts.forEach((cut) => {
    const cutBrush = new Brush(
      new THREE.BoxGeometry(cut.w, cut.h, cut.d),
      frameMaterial
    );
    cutBrush.updateMatrixWorld();
    result = evaluator.evaluate(result, cutBrush, SUBTRACTION);
  });

  result.castShadow = true;
  result.receiveShadow = true;

  // Inner panel
  const panelSize = {
    w: Math.max(0.1, width - bezelThickness * 0.5),
    h: Math.max(0.1, height - bezelThickness * 0.5),
    d: Math.max(0.1, depth - bezelThickness * 0.5),
  };

  const panelGeometry = new THREE.BoxGeometry(
    panelSize.w,
    panelSize.h,
    panelSize.d
  );
  const panels = new THREE.Mesh(panelGeometry, Materials.yellow());

  const group = new THREE.Group();
  group.add(result);
  group.add(panels);

  return group;
}

/**
 * Creates a wheel with stem
 */
function createWheel(radius, heightOffset) {
  const wheelGroup = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: COLORS.darkBlack });

  // Wheel
  const wheelGeo = new THREE.CylinderGeometry(radius, radius, 0.15, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const wheel = new THREE.Mesh(wheelGeo, mat);
  wheel.position.y = radius;

  // Stem
  const stemH = Math.max(0.01, heightOffset - radius);
  const stemGeo = new THREE.BoxGeometry(0.15, stemH, 0.15);
  const stem = new THREE.Mesh(stemGeo, mat);
  stem.position.y = radius + stemH / 2;

  wheelGroup.add(wheel, stem);
  return wheelGroup;
}

// ============================================================
// TOP UNIT BUILDER
// ============================================================
function createTopUnit(width, depth) {
  const footerHeight = 0.8;
  const bodyHeight = 4.0;
  const totalHeight = footerHeight + bodyHeight;

  const machineGroup = new THREE.Group();
  const evaluator = new Evaluator();

  // Materials
  const blackMat = Materials.black();
  const yellowMat = Materials.yellow();
  const chromeMat = Materials.chrome();
  const glassMat = Materials.glass();

  const leftUiMat = new THREE.MeshBasicMaterial({
    map: createLeftPanelTexture(),
  });
  const screenUiMat = new THREE.MeshBasicMaterial({ map: textures.screen });
  const rightUiMat = new THREE.MeshBasicMaterial({
    map: createRightPanelTexture(),
  });
  const sideMat = new THREE.MeshStandardMaterial({
    map: textures.sideImage,
    roughness: 0.3,
  });

  // Chin text
  const chinTextTexture = createTextTexture(
    ["MESIN INI DIBERSIHKAN SECARA RUTIN", "DENGAN PEMBERSIH DISINFEKTAN"],
    width,
    footerHeight,
    "#fdb627",
    "#000000"
  );
  const chinTextMat = new THREE.MeshStandardMaterial({
    map: chinTextTexture,
    roughness: 0.4,
  });

  // ---- SPACER FEET ----
  const spacerHeight = 0.08;
  const spacerRadius = 0.12;
  const spacerMat = new THREE.MeshStandardMaterial({ color: COLORS.darkBlack });
  const spacerGeo = new THREE.CylinderGeometry(
    spacerRadius,
    spacerRadius,
    spacerHeight,
    16
  );

  const inset = width * 0.35;
  const feetY = -totalHeight / 2 - spacerHeight / 2;

  const feetPositions = [
    { x: inset, z: inset },
    { x: -inset, z: inset },
    { x: inset, z: -inset },
    { x: -inset, z: -inset },
  ];

  feetPositions.forEach((pos) => {
    const foot = new THREE.Mesh(spacerGeo, spacerMat);
    foot.position.set(pos.x, feetY, pos.z);
    machineGroup.add(foot);
  });

  // ---- FOOTER SECTION ----
  const sliceRatio = 1 / 8;
  const frontSliceDepth = depth * sliceRatio;
  const backSliceDepth = depth * (1 - sliceRatio);

  // Back section (black)
  const backGeo = new THREE.BoxGeometry(width, footerHeight, backSliceDepth);
  const backMesh = new THREE.Mesh(backGeo, blackMat);
  backMesh.position.set(
    0,
    -totalHeight / 2 + footerHeight / 2,
    -frontSliceDepth / 2
  );
  machineGroup.add(backMesh);

  // Front section (yellow with text)
  const frontGeo = new THREE.BoxGeometry(width, footerHeight, frontSliceDepth);
  const frontMaterials = [
    yellowMat,
    yellowMat,
    yellowMat,
    yellowMat,
    chinTextMat,
    yellowMat,
  ];
  const frontMesh = new THREE.Mesh(frontGeo, frontMaterials);
  frontMesh.position.set(
    0,
    -totalHeight / 2 + footerHeight / 2,
    depth / 2 - frontSliceDepth / 2
  );
  machineGroup.add(frontMesh);

  // Text overlay plane
  const textPlaneGeo = new THREE.PlaneGeometry(
    width * 0.95,
    footerHeight * 0.9
  );
  const textPlane = new THREE.Mesh(textPlaneGeo, chinTextMat);
  textPlane.position.set(
    0,
    -totalHeight / 2 + footerHeight / 2,
    depth / 2 + 0.01
  );
  machineGroup.add(textPlane);

  // ---- MAIN BODY ----
  const bodyCenterY = -totalHeight / 2 + footerHeight + bodyHeight / 2;

  const bodyBrush = new Brush(
    new THREE.BoxGeometry(width, bodyHeight, depth),
    blackMat
  );
  bodyBrush.position.y = bodyCenterY;
  bodyBrush.updateMatrixWorld();

  // Panel dimensions
  const sidePanelW = width * 0.26;
  const margin = 0.1;
  const centerW = width - 2 * sidePanelW - 2 * margin;
  const screenW = centerW * 0.95;

  // Niche (coffee dispensing area)
  const nicheW = screenW * 0.8;
  const nicheH = 1.3;
  const nicheD = depth * 0.5;
  const nicheY = bodyCenterY - bodyHeight / 2 + nicheH / 2 + 0.2;

  const cutBrush = new Brush(
    new THREE.BoxGeometry(nicheW, nicheH, nicheD),
    blackMat
  );
  cutBrush.position.set(0, nicheY, depth / 2);
  cutBrush.updateMatrixWorld();

  const bodyResult = evaluator.evaluate(bodyBrush, cutBrush, SUBTRACTION);
  bodyResult.castShadow = true;
  bodyResult.receiveShadow = true;
  machineGroup.add(bodyResult);

  // ---- SIDE STICKERS ----
  const sideGeo = new THREE.PlaneGeometry(backSliceDepth, totalHeight);

  const leftSticker = new THREE.Mesh(sideGeo, sideMat);
  leftSticker.rotation.y = -Math.PI / 2;
  leftSticker.position.set(-width / 2 - 0.01, 0, -frontSliceDepth / 2);
  machineGroup.add(leftSticker);

  const rightSticker = new THREE.Mesh(sideGeo, sideMat);
  rightSticker.rotation.y = Math.PI / 2;
  rightSticker.position.set(width / 2 + 0.01, 0, -frontSliceDepth / 2);
  machineGroup.add(rightSticker);

  // ---- FRONT UI PANELS ----
  const frontFaceZ = depth / 2 + 0.01;
  const leftPanelX = -width / 2 + sidePanelW / 2 + margin / 2;
  const rightPanelX = width / 2 - sidePanelW / 2 - margin / 2;
  const sidePanelH = bodyHeight;

  // Left panel (Cara Pakai)
  const leftUiMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(sidePanelW, sidePanelH),
    leftUiMat
  );
  leftUiMesh.position.set(leftPanelX, bodyCenterY, frontFaceZ + 0.005);
  machineGroup.add(leftUiMesh);

  // Right panel (Info Icons)
  const rightUiMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(sidePanelW, sidePanelH),
    rightUiMat
  );
  rightUiMesh.position.set(rightPanelX, bodyCenterY, frontFaceZ + 0.005);
  machineGroup.add(rightUiMesh);

  // ---- CENTER SCREEN (Tablet) ----
  const nicheTopY = nicheY + nicheH / 2;
  const aspectRatio = 1.5;
  const screenH = screenW * aspectRatio;
  const screenY = nicheTopY + 0.1 + screenH / 2;
  const tabletDepth = 0.15;

  const tabletGeo = new THREE.BoxGeometry(screenW, screenH, tabletDepth);
  const tabletMaterials = [
    blackMat,
    blackMat,
    blackMat,
    blackMat,
    screenUiMat,
    blackMat,
  ];
  const screenMesh = new THREE.Mesh(tabletGeo, tabletMaterials);
  screenMesh.position.set(0, screenY, frontFaceZ + tabletDepth / 2);
  machineGroup.add(screenMesh);

  // ---- NOZZLES ----
  const nozzleGroup = new THREE.Group();
  [-0.3, 0.3].forEach((xPos) => {
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.05, 0.4),
      chromeMat
    );
    nozzle.position.x = xPos;
    nozzleGroup.add(nozzle);
  });
  nozzleGroup.position.set(
    0,
    nicheY + nicheH / 2 - 0.2,
    depth / 2 - nicheD / 2 + 0.5
  );
  machineGroup.add(nozzleGroup);

  // ---- DRIP TRAY ----
  const trayGeo = new THREE.BoxGeometry(nicheW, 0.1, nicheD / 1.5);
  const tray = new THREE.Mesh(trayGeo, chromeMat);
  tray.position.set(0, nicheY - nicheH / 2 + 0.1, depth / 2 - nicheD / 4);
  machineGroup.add(tray);

  // ---- TOP HOPPER ----
  const hopperH = 0.8;
  const hopperW = width * 0.35;
  const hopperD = depth * 0.4;

  const hopper = new THREE.Mesh(
    new THREE.BoxGeometry(hopperW, hopperH, hopperD),
    glassMat
  );
  hopper.position.set(
    -(width / 2) + hopperW / 2 + 0.2,
    bodyCenterY + bodyHeight / 2 + hopperH / 2 + 0.01,
    -depth / 4
  );
  machineGroup.add(hopper);

  // ---- TOP SIGN HOLDER ----
  const signH = 2.5;
  const signW = width * 0.45;
  const signD = 0.04;

  const holderGroup = new THREE.Group();

  // Acrylic panel
  const acrylicGeo = new THREE.BoxGeometry(signW, signH, signD);
  const acrylicPanel = new THREE.Mesh(acrylicGeo, glassMat);
  acrylicPanel.position.y = signH / 2;
  holderGroup.add(acrylicPanel);

  // Sign card
  const cardImgMat = new THREE.MeshBasicMaterial({ map: textures.signImage });
  const cardEdgeMat = new THREE.MeshBasicMaterial({ color: COLORS.white });
  const cardMaterials = [
    cardEdgeMat,
    cardEdgeMat,
    cardEdgeMat,
    cardEdgeMat,
    cardImgMat,
    cardImgMat,
  ];

  const cardGeo = new THREE.BoxGeometry(signW - 0.1, signH - 0.1, signD * 0.5);
  const card = new THREE.Mesh(cardGeo, cardMaterials);
  card.position.y = signH / 2;
  holderGroup.add(card);

  // Base
  const baseGeo = new THREE.BoxGeometry(signW, 0.05, 0.4);
  const base = new THREE.Mesh(baseGeo, glassMat);
  base.position.y = 0.025;
  holderGroup.add(base);

  holderGroup.position.set(
    0,
    bodyCenterY + bodyHeight / 2 + 0.01,
    depth / 2 - 1.2
  );
  machineGroup.add(holderGroup);

  // Store metadata
  machineGroup.userData = {
    totalHeight,
    spacerHeight,
  };

  return machineGroup;
}

// ============================================================
// MAIN COFFEE MACHINE ASSEMBLY
// ============================================================
export function createCoffeeMachine() {
  const machine = new THREE.Group();
  const { boxSize, bezelThickness, wheelRadius, wheelHeightOffset } =
    MACHINE_CONFIG;

  // ---- BASE UNIT ----
  const mainBase = createFramedBox(boxSize, boxSize, boxSize, bezelThickness);

  const frontDepth = 0.5;
  const frontExtension = createFramedBox(
    boxSize,
    boxSize,
    frontDepth,
    bezelThickness
  );
  frontExtension.position.z = boxSize / 2 + frontDepth / 2;

  const baseUnit = new THREE.Group();
  baseUnit.add(mainBase, frontExtension);

  // ---- WHEELS ----
  const minX = -boxSize / 2;
  const maxX = boxSize / 2;
  const minZ = -boxSize / 2;
  const maxZ = boxSize / 2 + frontDepth;
  const inset = 0.6;

  const wheelPositions = [
    { x: minX + inset, z: minZ + inset },
    { x: maxX - inset, z: minZ + inset },
    { x: minX + inset, z: maxZ - inset },
    { x: maxX - inset, z: maxZ - inset },
  ];

  wheelPositions.forEach((pos) => {
    const wheel = createWheel(wheelRadius, wheelHeightOffset);
    wheel.position.set(pos.x, 0, pos.z);
    machine.add(wheel);
  });

  baseUnit.position.y = boxSize / 2 + wheelHeightOffset;
  machine.add(baseUnit);

  // ---- TOP UNIT ----
  const topUnit = createTopUnit(boxSize * 0.95, boxSize * 0.9);
  const { totalHeight: unitH, spacerHeight: spacerH } = topUnit.userData;

  topUnit.position.y = boxSize + wheelHeightOffset + spacerH + unitH / 2;
  machine.add(topUnit);

  return machine;
}
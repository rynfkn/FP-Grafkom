// js/furniture.js
import * as THREE from "three";

export function createPedestalTable({
    topColor = 0x8F5E38,    // Warna Daun Meja
    baseColor = 0x8F5E38,   // Warna Kaki/Tiang Utama
    accentColor = 0x3E2723  // Warna Cincin/Detail Gelap
} = {}) {
    const tableGroup = new THREE.Group();

    // --- 1. Definisi Material ---
    
    // Material Daun Meja (Bisa berbeda dengan kaki)
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: topColor, 
        roughness: 0.5,
        metalness: 0.1
    });

    // Material Kaki/Tiang (Kayu Utama)
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: baseColor, 
        roughness: 0.6,
        metalness: 0.1
    });

    // Material Aksen Gelap (Untuk cincin di tengah tiang)
    const accentMaterial = new THREE.MeshStandardMaterial({ 
        color: accentColor, 
        roughness: 0.8,
        metalness: 0.1
    });

    // --- 2. Helper Function (Lokal) ---
    function createBox(width, height, depth, material, x, y, z) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    // --- 3. Parameter Dimensi Meja ---
    const tableSize = 2.5;      
    const tableHeight = 1.6;    
    const topThickness = 0.2;   
    const baseWidth = 1.0;      
    const colWidth = 0.6;       

    // --- 4. Konstruksi Geometri ---

    // A. Daun Meja (Table Top) - Menggunakan topMaterial
    const tableTop = createBox(tableSize, topThickness, tableSize, topMaterial, 0, tableHeight, 0);
    tableGroup.add(tableTop);

    // B. Konstruksi Kaki (Pedestal)
    const legHeight = tableHeight - (topThickness / 2); 
    
    // 1. Basis Paling Bawah (Plinth) - Menggunakan baseMaterial
    const basePlateHeight = 0.15;
    const basePlate = createBox(baseWidth + 0.2, basePlateHeight, baseWidth + 0.2, baseMaterial, 0, basePlateHeight/2, 0);
    tableGroup.add(basePlate);

    // 2. Tingkat Basis Kedua - Menggunakan baseMaterial
    const baseStepHeight = 0.1;
    const baseStep = createBox(baseWidth, baseStepHeight, baseWidth, baseMaterial, 0, basePlateHeight + baseStepHeight/2, 0);
    tableGroup.add(baseStep);

    // Hitung sisa ruang
    const currentY = basePlateHeight + baseStepHeight;
    const remainingH = tableHeight - (topThickness / 2) - currentY;
    
    // Pembagian Proporsi Tiang
    const lowerColH = remainingH * 0.4;
    const midColH = remainingH * 0.25;
    const upperColH = remainingH * 0.35;

    // Tiang Bawah (Kayu) - Menggunakan baseMaterial
    const lowerCol = createBox(colWidth, lowerColH, colWidth, baseMaterial, 0, currentY + lowerColH/2, 0);
    tableGroup.add(lowerCol);

    // Tiang Tengah (Aksen Cincin)
    const rings = 4;
    const ringH = midColH / rings;
    for(let i = 0; i < rings; i++) {
        // Skala selang-seling
        const scale = (i % 2 === 0) ? colWidth : colWidth * 0.95; 
        const ringY = currentY + lowerColH + (i * ringH) + ringH/2;
        // Gunakan accentMaterial di sini
        const ring = createBox(scale, ringH, scale, accentMaterial, 0, ringY, 0);
        tableGroup.add(ring);
    }

    // Tiang Atas (Kayu) - Menggunakan baseMaterial
    const upperColY = currentY + lowerColH + midColH + upperColH/2;
    const upperCol = createBox(colWidth, upperColH, colWidth, baseMaterial, 0, upperColY, 0);
    tableGroup.add(upperCol);

    return tableGroup;
}

export function createBench() {
    const benchGroup = new THREE.Group();

    // --- 1. Definisi Material ---
    // Menggunakan palet warna yang konsisten dengan meja sebelumnya
    
    // Kayu Terang (Untuk kaki, rangka, dan papan tengah)
    const lightWoodMat = new THREE.MeshStandardMaterial({ 
        color: 0x8D6E63, // Warm Teak
        roughness: 0.6,
        metalness: 0.1
    });

    // Kayu Gelap (Untuk papan pinggir dudukan dan aksen kotak)
    const darkWoodMat = new THREE.MeshStandardMaterial({ 
        color: 0x3E2723, // Dark Coffee / Hampir Hitam
        roughness: 0.7,
        metalness: 0.1
    });

    // --- 2. Helper Function ---
    function createBox(width, height, depth, material, x, y, z) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    // --- 3. Dimensi Bangku ---
    const benchWidth = 3.0;     // Panjang bangku
    const benchDepth = 1.0;    // Lebar ke belakang
    const benchHeight = 0.85;   // Tinggi bangku
    const legSize = 0.1;       // Ukuran tebal kaki
    const topThickness = 0.1;  // Tebal papan dudukan
    const apronHeight = 0.1;   // Tinggi rangka di bawah dudukan

    // --- 4. Konstruksi Geometri ---

    // A. Dudukan (Seat) - Terdiri dari 3 Papan Memanjang
    // Pembagian: Pinggir Gelap (25%) - Tengah Terang (50%) - Pinggir Gelap (25%)
    // Atau dibagi rata 3 bagian tergantung interpretasi visual. 
    // Berdasarkan foto, papan tengah terlihat sedikit lebih lebar atau sama. Kita bagi 3 rata agar simetris.
    
    const plankDepth = benchDepth / 3;
    const seatY = benchHeight - (topThickness / 2);

    // 1. Papan Belakang (Gelap)
    const backPlank = createBox(benchWidth, topThickness, plankDepth, darkWoodMat, 0, seatY, -plankDepth);
    benchGroup.add(backPlank);

    // 2. Papan Tengah (Terang)
    const centerPlank = createBox(benchWidth, topThickness, plankDepth, lightWoodMat, 0, seatY, 0);
    benchGroup.add(centerPlank);

    // 3. Papan Depan (Gelap)
    const frontPlank = createBox(benchWidth, topThickness, plankDepth, darkWoodMat, 0, seatY, plankDepth);
    benchGroup.add(frontPlank);

    // B. Detail Inlay (3 Kotak Gelap di Papan Tengah)
    const inlaySize = 0.06; // Ukuran kotak
    const inlayThickness = 0.005; // Sangat tipis, ditempel di atas atau "flush"
    const inlayY = benchHeight + (inlayThickness / 2); // Sedikit di atas permukaan agar tidak z-fighting

    // Posisi X untuk 3 kotak: Kiri, Tengah, Kanan
    const positions = [-benchWidth * 0.3, 0, benchWidth * 0.3];

    positions.forEach(posX => {
        const inlay = createBox(inlaySize, inlayThickness, inlaySize, darkWoodMat, posX, seatY + (topThickness/2) + 0.001, 0);
        benchGroup.add(inlay);
    });

    // C. Rangka Bawah (Apron)
    // Rangka penghubung kaki, sedikit masuk ke dalam (recessed) dari pinggir meja
    const apronRecess = 0.02; 
    const apronY = benchHeight - topThickness - (apronHeight / 2);
    
    // Apron Panjang (Depan & Belakang)
    const longApronWidth = benchWidth - (legSize * 2) - (apronRecess * 2);
    // Apron Depan
    benchGroup.add(createBox(longApronWidth, apronHeight, 0.02, lightWoodMat, 0, apronY, (benchDepth/2) - legSize/2));
    // Apron Belakang
    benchGroup.add(createBox(longApronWidth, apronHeight, 0.02, lightWoodMat, 0, apronY, -(benchDepth/2) + legSize/2));

    // Apron Pendek (Samping Kiri & Kanan)
    const shortApronDepth = benchDepth - (legSize * 2) - (apronRecess * 2);
    // Apron Kiri
    benchGroup.add(createBox(0.02, apronHeight, shortApronDepth, lightWoodMat, -(benchWidth/2) + legSize/2, apronY, 0));
    // Apron Kanan
    benchGroup.add(createBox(0.02, apronHeight, shortApronDepth, lightWoodMat, (benchWidth/2) - legSize/2, apronY, 0));


    // D. Kaki Bangku (Legs)
    // 4 Kaki balok solid di sudut
    const legH = benchHeight - topThickness; // Tinggi kaki = Tinggi total - tebal papan
    const legY = legH / 2;
    const legX = (benchWidth / 2) - (legSize / 2); // Flush dengan ujung lebar (atau sedikit masuk sesuai selera)
    const legZ = (benchDepth / 2) - (legSize / 2);

    // Kiri Depan
    benchGroup.add(createBox(legSize, legH, legSize, lightWoodMat, -legX, legY, legZ));
    // Kanan Depan
    benchGroup.add(createBox(legSize, legH, legSize, lightWoodMat, legX, legY, legZ));
    // Kiri Belakang
    benchGroup.add(createBox(legSize, legH, legSize, lightWoodMat, -legX, legY, -legZ));
    // Kanan Belakang
    benchGroup.add(createBox(legSize, legH, legSize, lightWoodMat, legX, legY, -legZ));

    return benchGroup;
}

export function createWallMagazine({
    frameColor = 0x8D6E63,   // Warna Kayu (Cokelat Medium)
    boardColor = 0x004D40,   // Warna Kain (Hijau Botol Gelap)
    metalColor = 0xD7D7D7,   // Warna List Aluminium (Perak)
    width = 5.0,             // Lebar total
    height = 2.0,             // Tinggi total
    posters = []
} = {}) {
    const madingGroup = new THREE.Group();

    // --- 1. Definisi Material ---
    const frameMat = new THREE.MeshStandardMaterial({ 
        color: frameColor, 
        roughness: 0.6,
        metalness: 0.1 
    });

    const boardMat = new THREE.MeshStandardMaterial({ 
        color: boardColor, 
        roughness: 0.9, // Kasar seperti kain/gabus
        metalness: 0.0 
    });

    const metalMat = new THREE.MeshStandardMaterial({ 
        color: metalColor, 
        roughness: 0.3, 
        metalness: 0.8  // Mengkilap seperti aluminium
    });

    const grooveMat = new THREE.MeshStandardMaterial({
        color: 0x3E2723, // Warna bayangan gelap untuk efek garis
        roughness: 1.0
    });

    // --- 2. Helper Function ---
    function createBox(w, h, d, material, x, y, z) {
        const geometry = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    // --- 3. Dimensi Komponen ---
    const frameThickness = 0.25; // Lebar bingkai kayu
    const depthFrame = 0.15;     // Ketebalan kayu ke depan
    const metalWidth = 0.03;     // Lebar list besi
    const boardDepth = 0.05;     // Ketebalan papan hijau

    // --- 4. Konstruksi Geometri ---

    // A. Papan Utama (Hijau)
    // Ukuran papan = Total - (Frame kiri kanan) - (List besi kiri kanan)
    const innerW = width - (frameThickness * 2);
    const innerH = height - (frameThickness * 2);
    const board = createBox(innerW, innerH, boardDepth, boardMat, 0, 0, 0);
    madingGroup.add(board);

    // B. List Aluminium (Inner Trim)
    // Kita buat kotak pipih di belakang frame kayu tapi di depan papan hijau
    const trimW = innerW + (metalWidth * 2);
    const trimH = innerH + (metalWidth * 2);
    const metalTrim = createBox(trimW, trimH, boardDepth + 0.01, metalMat, 0, 0, 0);
    madingGroup.add(metalTrim);

    // C. Frame Kayu Luar
    // Agar rapi, kita buat 4 bagian: Atas, Bawah, Kiri, Kanan.

    // 1. Frame Atas & Bawah (Panjang Full)
    const topFrame = createBox(width, frameThickness, depthFrame, frameMat, 0, (height/2) - (frameThickness/2), 0.02);
    const btmFrame = createBox(width, frameThickness, depthFrame, frameMat, 0, -(height/2) + (frameThickness/2), 0.02);
    madingGroup.add(topFrame);
    madingGroup.add(btmFrame);

    // 2. Frame Kiri & Kanan (Di antara atas & bawah)
    const sideH = height - (frameThickness * 2);
    const sideY = 0;
    const sideX = (width/2) - (frameThickness/2);
    
    const leftFrame = createBox(frameThickness, sideH, depthFrame, frameMat, -sideX, sideY, 0.02);
    const rightFrame = createBox(frameThickness, sideH, depthFrame, frameMat, sideX, sideY, 0.02);
    madingGroup.add(leftFrame);
    madingGroup.add(rightFrame);

    // D. Detail Grooves (Garis-garis pada sisi samping)
    // Berdasarkan gambar, ada aksen garis horizontal di frame kiri dan kanan.
    // Kita simulasikan dengan kotak tipis berwarna gelap.
    
    const grooveCount = 5;       // Jumlah garis
    const grooveSpacing = 0.08;  // Jarak antar garis
    const grooveThick = 0.01;    // Tebal garis
    const grooveDepth = depthFrame + 0.005; // Sedikit menonjol biar tidak flickering

    // Loop untuk membuat garis di sisi Kiri dan Kanan
    for(let i = 0; i < grooveCount; i++) {
        // Kita posisikan di tengah-tengah frame samping (secara vertikal)
        // Offset Y agar terpusat
        const startY = -((grooveCount * grooveSpacing) / 2) + (grooveSpacing/2);
        const yPos = startY + (i * grooveSpacing);

        // Garis Kiri
        const grooveLeft = createBox(frameThickness, grooveThick, grooveDepth, grooveMat, -sideX, yPos, 0.02);
        madingGroup.add(grooveLeft);

        // Garis Kanan
        const grooveRight = createBox(frameThickness, grooveThick, grooveDepth, grooveMat, sideX, yPos, 0.02);
        madingGroup.add(grooveRight);
    }

    if(posters && posters.length > 0) {
        const loader = new THREE.TextureLoader();
        const posterZ = (boardDepth / 2) + 0.015;

        posters.forEach((poster) => {
            const texture = loader.load(poster.url);
            texture.colorSpace = THREE.SRGBColorSpace;

            const pWidth = poster.w || 0.5;
            const pHeight = poster.h || 0.7;
            const geometry = new THREE.PlaneGeometry(pWidth, pHeight);

            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                transparent: true,
                side: THREE.FrontSide
            });

            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(poster.x || 0, poster.y || 0, posterZ);

            madingGroup.add(mesh);
        });
    }

    return madingGroup;
}

export function createTV() {
    const tvGroup = new THREE.Group();

    const casingMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.3,
        metalness: 0.6
    });

    const video = document.createElement('video');
    video.src = 'assets/nabil.mp4';
    video.loop = true;
    video.play().catch(() => {
        window.addEventListener('click', () => video.play(), { once: true });
    });

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    const screenMat = new THREE.MeshBasicMaterial({
        map: videoTexture
    });

    function createBox(width, height, depth, material, x, y, z) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    const tvWidth = 4.0;
    const tvHeight = 2.25;
    const tvDepth = 0.1;
    const bezelSize = 0.1;
    const screenRecess = 0.01;

    const body = createBox(tvWidth, tvHeight, tvDepth, casingMat, 0, 0, 0);
    tvGroup.add(body);

    const screenW = tvWidth - (bezelSize * 2);
    const screenH = tvHeight - (bezelSize * 2);
    const screenZ = (tvDepth / 2) + screenRecess; 

    const screen = createBox(screenW, screenH, 0.01, screenMat, 0, 0, screenZ);
    tvGroup.add(screen);

    const mount = createBox(tvWidth * 0.5, tvHeight * 0.5, 0.05, casingMat, 0, 0, -tvDepth);
    tvGroup.add(mount);

    return tvGroup;
}

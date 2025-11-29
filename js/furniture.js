// js/furniture.js
import * as THREE from "three";

export function createPedestalTable() {
    const tableGroup = new THREE.Group();

    // --- 1. Definisi Material ---
    // Material Kayu Utama (Cokelat Medium - Warm Teak)
    const woodMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8D6E63, 
        roughness: 0.5,
        metalness: 0.1
    });

    // Material Aksen Gelap (Untuk cincin di tengah tiang)
    const darkWoodMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3E2723, // Hampir hitam/kopi
        roughness: 0.7,
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
    const tableSize = 2.5;      // Panjang/Lebar Meja Persegi
    const tableHeight = 1.6;    // Tinggi Total
    const topThickness = 0.2;   // Tebal Daun Meja
    const baseWidth = 1.0;      // Lebar kaki bawah
    const colWidth = 0.6;       // Lebar tiang tengah

    // --- 4. Konstruksi Geometri ---

    // A. Daun Meja (Table Top) - Persegi
    const tableTop = createBox(tableSize, topThickness, tableSize, woodMaterial, 0, tableHeight, 0);
    tableGroup.add(tableTop);

    // B. Konstruksi Kaki (Pedestal)
    // Hitung area kerja vertikal (dari lantai sampai bawah meja)
    const legHeight = tableHeight - (topThickness / 2); 
    
    // 1. Basis Paling Bawah (Plinth)
    const basePlateHeight = 0.15;
    const basePlate = createBox(baseWidth + 0.2, basePlateHeight, baseWidth + 0.2, woodMaterial, 0, basePlateHeight/2, 0);
    tableGroup.add(basePlate);

    // 2. Tingkat Basis Kedua
    const baseStepHeight = 0.1;
    const baseStep = createBox(baseWidth, baseStepHeight, baseWidth, woodMaterial, 0, basePlateHeight + baseStepHeight/2, 0);
    tableGroup.add(baseStep);

    // Hitung sisa ruang untuk tiang vertikal
    const currentY = basePlateHeight + baseStepHeight;
    const remainingH = tableHeight - (topThickness / 2) - currentY;
    
    // Pembagian Proporsi Tiang:
    // Bawah (Kayu) 40% | Tengah (Aksen Cincin) 20% | Atas (Kayu) 40%
    const lowerColH = remainingH * 0.4;
    const midColH = remainingH * 0.25;
    const upperColH = remainingH * 0.35;

    // Tiang Bawah (Kayu)
    const lowerCol = createBox(colWidth, lowerColH, colWidth, woodMaterial, 0, currentY + lowerColH/2, 0);
    tableGroup.add(lowerCol);

    // Tiang Tengah (Aksen Gelap Berigi/Cincin)
    const rings = 4;
    const ringH = midColH / rings;
    for(let i = 0; i < rings; i++) {
        // Skala selang-seling untuk efek tekstur berigi
        const scale = (i % 2 === 0) ? colWidth : colWidth * 0.95; 
        const ringY = currentY + lowerColH + (i * ringH) + ringH/2;
        const ring = createBox(scale, ringH, scale, darkWoodMaterial, 0, ringY, 0);
        tableGroup.add(ring);
    }

    // Tiang Atas (Kayu)
    const upperColY = currentY + lowerColH + midColH + upperColH/2;
    const upperCol = createBox(colWidth, upperColH, colWidth, woodMaterial, 0, upperColY, 0);
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
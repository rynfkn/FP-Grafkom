import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Sesuaikan path import jika perlu

export function loadVendingMachine(scene) {
    const loader = new GLTFLoader();

    loader.load(
        'models/vending-machine/scene.gltf',
        function (gltf) {
            const vendingMachine = gltf.scene;

            const scaleFactor = 2.5; 
            vendingMachine.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            // Memastikan matrix terupdate sebelum menghitung Bounding Box
            vendingMachine.updateMatrixWorld(); 
            
            const box = new THREE.Box3().setFromObject(vendingMachine);
            const size = box.getSize(new THREE.Vector3());

            // Mengatur posisi (yOffset agar model tepat di atas tanah/grid)
            const yOffset = -box.min.y;
            vendingMachine.position.set(8, yOffset, -8);
            vendingMachine.rotation.y = Math.PI; 

            // Mengaktifkan bayangan
            vendingMachine.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(vendingMachine);
            console.log('Vending machine loaded. Height is:', size.y);
        },
        undefined,
        function (error) {
            console.error('Error loading vending machine:', error);
        }
    );
}
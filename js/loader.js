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


export function loadHelmet(scene) {
    const loader = new GLTFLoader();

    loader.load(
        'models/moto_helmet/scene.gltf',
        function (gltf) {
            const helmet = gltf.scene;
            const scaleFactor = 1.2;
            helmet.scale.set(scaleFactor, scaleFactor, scaleFactor);
            helmet.position.set(-4.5, 2.2, -7.5);
            helmet.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }   
            });
            scene.add(helmet);
        },
        undefined,
        function (error) {
            console.error('Error loading helmet:', error);
        }
    );
}

export function loadMotorcycleHelmet(scene) {
    const loader = new GLTFLoader();
    
    loader.load(
        'models/motorcycle_helmet/scene.gltf',
        function (gltf) {
            const motorcycleHelmet = gltf.scene;
            const scaleFactor = 0.3;
            motorcycleHelmet.scale.set(scaleFactor, scaleFactor, scaleFactor);
            motorcycleHelmet.position.set(-3.5, 2.5, -8);
            motorcycleHelmet.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(motorcycleHelmet);
        },
        undefined,
        function (error) {
            console.error('Error loading motorcycle helmet:', error);
        }
    );
}

export function loadTrashCan(scene) {
    const loader = new GLTFLoader();

    loader.load(
        'models/small_office_trash_can/scene.gltf',
        function (gltf) {
            const sink = gltf.scene;

            const scaleFactor = 2.5; 
            sink.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            sink.updateMatrixWorld(); 
            
            const box = new THREE.Box3().setFromObject(sink);
            const yOffset = -box.min.y;
            
            // Position it somewhere reasonable, e.g., near a wall
            sink.position.set(-8.5, yOffset, -11); 
            sink.rotation.y = Math.PI / 2;

            sink.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(sink);
            console.log('Trash can loaded.');
        },
        undefined,
        function (error) {
            console.error('Error loading trash can:', error);
        }
    );
}

export function loadBathroomSink(scene) {
    const loader = new GLTFLoader();

    loader.load(
        'models/bathroom_sink_01/scene.gltf',
        function (gltf) {
            const sink = gltf.scene;

            const scaleFactor = 2.5; 
            sink.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            sink.updateMatrixWorld(); 
            
            const box = new THREE.Box3().setFromObject(sink);
            const yOffset = -box.min.y + 2;
            
            sink.position.set(-9.75, yOffset, -7); 
            sink.rotation.y = 0;

            sink.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            scene.add(sink);
            console.log('Bathroom sink loaded.');
        },
        undefined,
        function (error) {
            console.error('Error loading bathroom sink:', error);
        }
    );
}
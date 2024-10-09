import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export default function ThirdPersonCamera({ avatarRef, isMoving }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef();
    const avatarPos = new THREE.Vector3(0, 1, 0); // Offset to follow the avatar from above

    // Function to keep camera behind the avatar
    const updateCameraPosition = () => {
        if (avatarRef.current) {
            const avatarPosition = avatarRef.current.position.clone();

            // Adjust the camera offset to follow behind the avatar
            const cameraOffset = new THREE.Vector3(0, 2, -2); // Negative Z to follow behind the avatar
            cameraOffset.applyQuaternion(avatarRef.current.quaternion); // Align with avatar's rotation

            avatarPosition.add(cameraOffset); // Add offset to avatar's position
            camera.position.lerp(avatarPosition, 0.1); // Smooth follow
            camera.lookAt(avatarRef.current.position); // Always look at the avatar
        }
    };


    // OrbitControls should allow free camera rotation around the avatar
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.maxPolarAngle = Math.PI / 2.5; // Restrict vertical rotation
        controls.minPolarAngle = 0.3; // Limit to a reasonable angle above the character
        controls.enablePan = false; // Prevent the camera from panning
        controls.enableZoom = false

        return () => {
            controls.dispose();
        };
    }, [camera, gl.domElement]);

    // Update the camera and controls in every frame
    useFrame(() => {
        if (isMoving) {
            updateCameraPosition();
        }

        if (controlsRef.current) {
            controlsRef.current.target.copy(avatarRef.current ? avatarRef.current.position : avatarPos); 
            controlsRef.current.update();
        }
    });

    return null;
}

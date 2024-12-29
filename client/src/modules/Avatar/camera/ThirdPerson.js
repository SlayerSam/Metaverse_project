import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export default function ThirdPersonCamera({ avatarRef, isMoving }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef();
    const avatarPos = new THREE.Vector3(0, 1, 0); // Offset to follow the avatar from above

    useEffect(() => {
        // Set initial camera position directly behind the avatar
        if (avatarRef.current) {
            const initialOffset = new THREE.Vector3(0, 2, -5); // Higher Y and -Z to set it behind the avatar
            camera.position.copy(avatarRef.current.position.clone().add(initialOffset));
            camera.lookAt(avatarRef.current.position); // Ensure it looks at the avatar initially
        }

        // Initialize OrbitControls
        const controls = new OrbitControls(camera, gl.domElement);
        controlsRef.current = controls;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.maxPolarAngle = Math.PI / 2.2; // Restrict vertical rotation
        controls.minPolarAngle = 0.2; // Limit to a reasonable angle above the character
        controls.enablePan = false; // Prevent the camera from panning
        controls.enableZoom = false;

        return () => {
            controls.dispose();
        };
    }, [camera, gl.domElement]);

    const updateCameraPosition = () => {
        if (avatarRef.current) {
            const avatarPosition = avatarRef.current.position.clone();
            const cameraOffset = new THREE.Vector3(0, 2, -3);
            cameraOffset.applyQuaternion(avatarRef.current.quaternion);

            avatarPosition.add(cameraOffset);
            camera.position.lerp(avatarPosition, 0.1); // Smooth follow
            camera.lookAt(avatarRef.current.position); // Always look at the avatar
        }
    };
    
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

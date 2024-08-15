import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function ThirdPersonCamera({ avatarRef }) {
    const { camera } = useThree();

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 5, -5);
        if (avatarRef.current) {
            idealOffset.applyQuaternion(avatarRef.current.quaternion);
            idealOffset.add(avatarRef.current.position);
        }
        return idealOffset;
    };

    const calculateLookAt = () => {
        const idealLookAt = new THREE.Vector3(0, 1, 20); 
        if (avatarRef.current) {
            idealLookAt.applyQuaternion(avatarRef.current.quaternion);
            idealLookAt.add(avatarRef.current.position);
        }
        return idealLookAt;
    };

    useFrame(() => {
        if (avatarRef.current) {
            const idealOffset = calculateOffset();
            const idealLookAt = calculateLookAt();
            camera.position.copy(idealOffset);
            camera.lookAt(idealLookAt);
        }
    });

    return (
        null
    );
}

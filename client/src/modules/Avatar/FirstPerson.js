import { PointerLockControls } from '@react-three/drei';
import React from 'react'
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

export default function FirstPersonCamera({ avatarRef }) {
    const { camera } = useThree();

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 3, 0);
        if (avatarRef.current) {
            idealOffset.applyQuaternion(avatarRef.current.quaternion);
            idealOffset.add(avatarRef.current.position);
        }
        return idealOffset;
    };

    const calculateLookAt = () => {
        const idealLookAt = new THREE.Vector3(0, 4, 50);
        if (avatarRef.current) {
            idealLookAt.applyQuaternion(avatarRef.current.quaternion);
            idealLookAt.add(avatarRef.current.position);
        }
        return idealLookAt;
    };

    useFrame(() => {
        if (!avatarRef.current) return;

        const idealOffset = calculateOffset();
        const idealLookAt = calculateLookAt();

        camera.position.copy(idealOffset);
        camera.lookAt(idealLookAt);
    });

    return <PointerLockControls />;
};
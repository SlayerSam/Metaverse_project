'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { useGLTF, OrbitControls, PointerLockControls, Stats } from '@react-three/drei';
import { Avatar } from './Avatar';
import * as THREE from 'three';

const ThirdPersonCamera = ({ avatarRef }) => {
    const { camera, gl } = useThree();
    const orbitControlsRef = useRef();

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 5, -5);
        if (avatarRef.current) {
            idealOffset.applyQuaternion(avatarRef.current.quaternion);
            idealOffset.add(avatarRef.current.position);
        }
        return idealOffset;
    };

    const calculateLookAt = () => {
        const idealLookAt = new THREE.Vector3(0, -5, 40);
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

            // Update OrbitControls target
            orbitControlsRef.current.target.copy(avatarRef.current.position);
        }
    });

    return <OrbitControls ref={orbitControlsRef} target={avatarRef.current ? avatarRef.current.position : new THREE.Vector3(0, 0, 0)} />;
};

const FirstPersonCamera = ({ avatarRef }) => {
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

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

export default function Scene() {
    const avatarRef = useRef();
    const [isFirstPerson, setIsFirstPerson] = useState(false);

    const toggleCamera = () => {
        setIsFirstPerson(!isFirstPerson);
    };

    return (
        <>
            <Canvas shadows>
                {isFirstPerson ? (
                    <FirstPersonCamera avatarRef={avatarRef} />
                ) : (
                    <ThirdPersonCamera avatarRef={avatarRef} />
                )}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Base url={'/models/base.glb'} />
                <Avatar group={avatarRef} />
            </Canvas>
            <button onClick={toggleCamera} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {isFirstPerson ? 'change to TPP' : 'change to FPP'}
            </button>
        </>
    );
}

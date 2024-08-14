'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';
import * as THREE from 'three';

const ThirdPersonCamera = ({ avatarRef, camera }) => {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3)

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 5, -5);
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
        camera.position.set(10, 20, 40)
        const idealOffset = calculateOffset();
        const idealLookAt = calculateLookAt();

        camera.position.copy(idealOffset);
        camera.rotation.set(3.5, 0, 0)
        camera.lookAt(idealLookAt);
        console.log(camera.position)
    });

    return null
};

const FirstPersonCamera = ({ avatarRef, camera }) => {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3)
    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 3, -0.6);
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
        camera.position.set(10, 20, 40)
        const idealOffset = calculateOffset();
        const idealLookAt = calculateLookAt();

        camera.position.copy(idealOffset);
        camera.lookAt(idealLookAt);
    });

    return null
}

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

export default function Scene() {
    const avatarRef = useRef();
    const [isFirstPerson, setIsFirstPerson] = useState(false);
    let camera = null

    const toggleCamera = () => {
        setIsFirstPerson(!isFirstPerson);
    };

    return (
        <>
            <Canvas shadows camera={camera}>
                <OrbitControls />
                {isFirstPerson ? (
                    <FirstPersonCamera avatarRef={avatarRef} camera={camera} />
                ) : (
                    <ThirdPersonCamera avatarRef={avatarRef} camera={camera} />
                )}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Base url={'/models/base.glb'} />
                <Avatar group={avatarRef} />
            </Canvas>
            <button onClick={toggleCamera} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                Toggle Camera
            </button>
        </>
    );
}
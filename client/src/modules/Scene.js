'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { useGLTF, OrthographicCamera, OrbitControls, FirstPersonControls, PerspectiveCamera } from '@react-three/drei';
import { Avatar } from './Avatar';
import * as THREE from 'three';

const ThirdPersonCamera = ({ avatarRef, camera }) => {
    useEffect(() => {
        if (camera.current) {
            console.log(camera.current)
            camera.current.position.set(0, 1.5, 5);
        }
    }, []);

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 1.5, 5);
        if (avatarRef.current) {
            idealOffset.applyQuaternion(avatarRef.current.quaternion);
            idealOffset.add(avatarRef.current.position);
        }
        return idealOffset;
    };

    const calculateLookAt = () => {
        const idealLookAt = new THREE.Vector3(0, 10, 50);
        if (avatarRef.current) {
            idealLookAt.applyQuaternion(avatarRef.current.quaternion);
            idealLookAt.add(avatarRef.current.position);
        }
        return idealLookAt;
    };

    useFrame(() => {
        camera.current.position.set(10, 20, 40)
        const idealOffset = calculateOffset();
        const idealLookAt = calculateLookAt();

        if (camera.current) {
            camera.current.position.copy(idealOffset);
            camera.current.lookAt(idealLookAt);
        }
    });

    return (
        <>
            <PerspectiveCamera
                ref={camera}
                fov={75}
                aspect={window.innerWidth / window.innerHeight}
                near={1}
                far={1000}
            />
        </>
    );
};


const FirstPersonCamera = ({ avatarRef }) => {
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 3)
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

    return (
        <group >
            <cameraHelper args={[camera]} />
        </group>
    )
}

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

export default function Scene() {
    const avatarRef = useRef();
    const camera = useRef()
    const [isOrthographic, setIsOrthographic] = useState(false);

    const toggleCamera = () => {
        console.log(isOrthographic)
        setIsOrthographic(!isOrthographic);
    };

    return (
        <>
            <Canvas shadows camera={{ position: [0, 3, -0.6], fov: 60 }}>
                <OrbitControls />
                <FirstPersonCamera avatarRef={avatarRef} />
                {/* <ThirdPersonCamera avatarRef={avatarRef} camera={camera} /> */}
                {/* {isOrthographic ? (
                    <>
                    </>
                ) :
                    <>
                        <PerspectiveCamera
                        />
                    </>
                } */}
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
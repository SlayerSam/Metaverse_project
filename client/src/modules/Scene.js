'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, Suspense } from 'react';
import { useGLTF, OrbitControls, PointerLockControls, Stats, Environment } from '@react-three/drei';
import { Avatar } from './Avatar/Avatar';
import * as THREE from 'three';
import FirstPerson from './Avatar/FirstPerson';
import ThirdPersonCamera from './Avatar/ThirdPerson';
import FirstPersonCamera from './Avatar/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';


export default function Scene() {
    const avatarRef = useRef();
    const canvasRef = useRef();
    const [isFirstPerson, setIsFirstPerson] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true)

    const toggleCamera = () => {
        setIsFirstPerson(!isFirstPerson);
    };

    return (
        <>
            <Canvas shadows ref={canvasRef}>
                <Environment files='/models/base.hdr' />
                {isFirstPerson ? <FirstPersonCamera avatarRef={avatarRef} isMoving={isMoving} /> : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />}
                <Suspense fallback={null}>
                    {BaseUrl ? <SampleBase /> : <SampleBase2 />}
                </Suspense>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 100]} />
                <Avatar group={avatarRef} setBaseUrl={setBaseUrl} canvasRef={canvasRef} setIsMoving={setIsMoving} />
            </Canvas>
            <button onClick={toggleCamera} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {isFirstPerson ? 'change to TPP' : 'change to FPP'}
            </button>
        </>
    );
}

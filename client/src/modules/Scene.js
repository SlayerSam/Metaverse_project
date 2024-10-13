'use client';
import { Canvas } from '@react-three/fiber';
import { useRef, useState, Suspense } from 'react';
import { Environment } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';


export default function Scene({ isOpen, isFirstPerson }) {
    const avatarRef = useRef();
    const [headNode, setHeadNode] = useState()
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true)

    return (
        <>
            <Canvas shadows>
                <Environment preset='night' />
                {isFirstPerson ? <FirstPersonCamera headNode={headNode} avatarRef={avatarRef} isMoving={isMoving} /> : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />}
                <Suspense fallback={null}>
                    {BaseUrl ? <SampleBase /> : <SampleBase2 />}
                </Suspense>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 100]} />
                <Avatar group={avatarRef} setHeadNode={setHeadNode} isFirstPerson={isFirstPerson} setBaseUrl={setBaseUrl} setIsMoving={setIsMoving} isOpen={isOpen} />
            </Canvas>
        </>
    );
}

'use client';
import { Canvas } from '@react-three/fiber';
import { useRef, useState, Suspense } from 'react';
import { Environment } from '@react-three/drei';
import ThirdPersonCamera from './Avatar/camera/ThirdPerson';
import FirstPersonCamera from './Avatar/camera/FirstPerson';
import SampleBase from './Base/SampleBase';
import { SampleBase2 } from './Base/SampleBase2';
import { Avatar } from './Avatar';


export default function Scene({ isOpen }) {
    const avatarRef = useRef();
    const [isFirstPerson, setIsFirstPerson] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [BaseUrl, setBaseUrl] = useState(true)

    const toggleCamera = () => {
        setIsFirstPerson(!isFirstPerson);
    };

    return (
        <>
            <Canvas shadows>
                <Environment preset='night' />
                {isFirstPerson ? <FirstPersonCamera avatarRef={avatarRef} isMoving={isMoving} /> : <ThirdPersonCamera avatarRef={avatarRef} isMoving={isMoving} />}
                <Suspense fallback={null}>
                    {BaseUrl ? <SampleBase /> : <SampleBase2 />}
                </Suspense>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 100]} />
                <Avatar group={avatarRef} setBaseUrl={setBaseUrl} setIsMoving={setIsMoving} isOpen={isOpen} />
            </Canvas>
            <button onClick={toggleCamera} className='absolute top-[10px] left-[10px]'>
                {isFirstPerson ? 'change to TPP' : 'change to FPP'}
            </button>
        </>
    );
}

'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { useGLTF, OrthographicCamera, OrbitControls, FirstPersonControls, PerspectiveCamera } from '@react-three/drei';
import { Avatar } from './Avatar';
import * as THREE from 'three';

const Camera = ({ avatarRef, isOrthographic }) => {
    const cameraRef = useRef();
    const helperRef = useRef();

    useEffect(() => {
        if (cameraRef.current) {
            helperRef.current = new THREE.CameraHelper(cameraRef.current);
            cameraRef.current.parent.add(helperRef.current);
        }
        return () => {
            if (helperRef.current) {
                helperRef.current.parent.remove(helperRef.current);
            }
        };
    }, []);

    useFrame((state) => {
        const camera = state.camera;
        if (avatarRef.current) {
            const avatarPosition = avatarRef.current.position.clone();

            if (isOrthographic) {
                camera.position.copy(avatarPosition);
                camera.position.z -= 5; // Set a fixed distance behind the avatar
            } else {
                camera.position.copy(avatarPosition);
                camera.position.z -= 2;
                camera.position.y += 3;
                camera.position.x = avatarPosition.x;
            }
            camera.lookAt(avatarRef.current.position);

            if (helperRef.current) {
                helperRef.current.update();
            }
        }
    });

    return <perspectiveCamera ref={cameraRef} makeDefault fov={75} near={0.1} far={1000} />;
};

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

export default function Scene() {
    const avatarRef = useRef();
    const [isOrthographic, setIsOrthographic] = useState(false);

    const toggleCamera = () => {
        console.log(isOrthographic)
        setIsOrthographic(!isOrthographic);
    };

    return (
        <>
            <Canvas>
                {isOrthographic ? (
                    <>
                        <OrbitControls />
                        <OrthographicCamera
                            left={window.innerWidth / - 2} right={window.innerWidth / 2} top={window.innerHeight / 2} bottom={window.innerHeight / - 2} near={0.1} far={1000}
                        />
                    </>
                ) :
                    <>
                        <FirstPersonControls />
                        <PerspectiveCamera
                            fov={45} aspect={window.innerWidth / window.innerHeight} near={1} far={1000}
                        />
                    </>
                }
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
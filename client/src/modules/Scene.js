'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { useGLTF, OrthographicCamera, OrbitControls } from '@react-three/drei';
import { Avatar } from './Avatar';

const Camera = ({ avatarRef, isOrthographic }) => {
    useFrame((state) => {
        const camera = state.camera;
        if (avatarRef.current) {
            const avatarPosition = avatarRef.current.position.clone();

            if (isOrthographic) {
                camera.position.copy(avatarPosition);
                camera.position.z -= 5; // Set a fixed distance behind the avatar
                camera.lookAt(avatarRef.current.position);

            } else {
                camera.position.copy(avatarPosition);
                camera.position.z -= 2;
                camera.position.y += 3;
                camera.position.x = avatarPosition.x;
                camera.lookAt(avatarRef.current.position);
            }
        }
    });
};

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

export default function Scene() {
    const avatarRef = useRef();
    const [isOrthographic, setIsOrthographic] = useState(false);

    const toggleCamera = () => {
        setIsOrthographic(!isOrthographic);
    };

    return (
        <>
            <Canvas>
                {isOrthographic ? (
                    <>
                        <OrthographicCamera
                            makeDefault
                            zoom={50}
                            near={0.1}
                            far={1000}
                            rotation={[-Math.PI / 4, Math.PI / 4, 0]}
                        />
                        <OrbitControls />
                    </>
                ) : (
                    <perspectiveCamera
                        makeDefault
                        fov={75}
                        near={0.1}
                        far={1000}
                    />
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
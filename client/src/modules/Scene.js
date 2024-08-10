'use client';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useRef, useEffect, forwardRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const Avatar = forwardRef(({ url }, ref) => {
    const avatarRef = ref || useRef(); // Use the forwarded ref or create a new one
    const { scene, animations } = useGLTF(url);
    const { actions } = useAnimations(animations, avatarRef);

    // Control the avatar
    const keys = {};
    const speed = 0.1;

    // Handle keyboard events
    const handleKeyDown = (event) => {
        keys[event.code] = true;
    };

    const handleKeyUp = (event) => {
        keys[event.code] = false;
    };

    useFrame(() => {
        let isMoving = false;

        // Check for movement keys
        if (keys['ArrowUp'] || keys['KeyW']) {
            avatarRef.current.position.z -= speed;
            isMoving = true;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            avatarRef.current.position.z += speed;
            isMoving = true;
        }
        if (keys['ArrowLeft'] || keys['KeyA']) {
            avatarRef.current.position.x -= speed;
            isMoving = true;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            avatarRef.current.position.x += speed;
            isMoving = true;
        }

        // Play animations based on movement state
        if (isMoving) {
            actions['Walking']?.play(); // Play walking animation
            actions['Rest']?.stop(); // Ensure pose is not active
        } else {
            actions['Walking']?.stop(); // Stop walking animation
            actions['Rest']?.play(); // Always play pose when idle
        }
    });

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return <primitive object={scene} ref={avatarRef} />;
});

const Camera = ({ avatarRef }) => {
    const cameraRef = useRef();

    useFrame(() => {
        if (avatarRef.current) {
            // Set camera position relative to the avatar
            cameraRef.current.position.x = avatarRef.current.position.x;
            cameraRef.current.position.y = avatarRef.current.position.y + 1; // Slightly above the avatar
            cameraRef.current.position.z = avatarRef.current.position.z + 3; // Behind the avatar
            cameraRef.current.lookAt(avatarRef.current.position);
        }
    });

    return <perspectiveCamera ref={cameraRef} fov={75} position={[0, 1, 3]} />;
};

const Base = ({ url }) => {
    const base = useGLTF(url);
    return <primitive object={base.scene} />;
};

const GameScene = () => {
    const avatarRef = useRef();

    return (
        <Canvas className="w-full h-screen">
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Camera avatarRef={avatarRef} />
            {/* <Base url="/models/metaverse.glb" /> */}
            <Avatar url="/models/Avatar.glb" ref={avatarRef} />
        </Canvas>
    );
};

export default GameScene;

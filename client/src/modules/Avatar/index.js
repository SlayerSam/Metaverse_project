import React, { useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { AvatarModel } from './AvatarModel';

export function Avatar({ group, setIsMoving, isFirstPerson, isOpen }) {
    const { nodes, materials, animations } = useGLTF('/models/Avatar.glb');
    const { actions, mixer } = useAnimations(animations, group); // Get mixer for handling events
    const [keys, setKeys] = useState({});
    const [isJumping, setIsJumping] = useState(false);
    const [velocityY, setVelocityY] = useState(0); // Keep track of jump velocity
    const { camera } = useThree();

    const speed = 0.1;
    const rotationSpeed = 0.05;
    const jumpSpeed = 0.15; // Speed at which avatar jumps
    const gravity = 0.01; // Gravity factor

    const handleKeyDown = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }));
    };

    useFrame(() => {
        if (isOpen) return;

        const direction = new THREE.Vector3();
        const headNode = nodes['mixamorigHead']; // Use your head node directly

        // Get the direction the avatar is facing
        group.current.getWorldDirection(direction);
        direction.y = 0; // Ignore the vertical direction
        direction.normalize();

        // Move the avatar based on key inputs
        let isMoving = false;
        if (!isJumping) {
            if (keys['ArrowUp'] || keys['KeyW']) {
                group.current.position.add(direction.clone().multiplyScalar(speed));
                isMoving = true;
            }

            if (keys['ArrowDown'] || keys['KeyS']) {
                group.current.position.add(direction.clone().multiplyScalar(-speed));
                isMoving = true;
            }

            if (keys['ArrowLeft'] || keys['KeyA']) {
                group.current.rotation.y += rotationSpeed;
                isMoving = true;
            }

            if (keys['ArrowRight'] || keys['KeyD']) {
                group.current.rotation.y -= rotationSpeed;
                isMoving = true;
            }
        }

        // Jump logic (manual control of jump movement)
        if (keys['Space'] && !isJumping && group.current.position.y <= 0) {
            setIsJumping(true);
            actions['jump'].play();
            setVelocityY(jumpSpeed); // Set initial jump speed

            // Play the jump animation without affecting the position
            actions['jump'].reset().play().setLoop(THREE.LoopOnce, 1);
            mixer.addEventListener('finished', () => {
                actions['jump'].stop(); // Stop the jump animation after it's finished
            });
        }

        // Apply gravity and update vertical position
        if (isJumping) {
            group.current.position.y += velocityY;
            setVelocityY((v) => v - gravity); // Apply gravity to slow down jump

            // If avatar lands on the ground
            if (group.current.position.y <= 0) {
                group.current.position.y = 0; // Ensure avatar stays on the ground
                setIsJumping(false); // Allow jumping again
                setVelocityY(0); // Reset velocity
            }
        }

        // Set camera position and rotation based on head node
        if (headNode && isFirstPerson) {
            const headPosition = new THREE.Vector3();
            headNode.getWorldPosition(headPosition);
            camera.position.copy(headPosition);

            // Adjust camera's rotation to match head rotation
            camera.rotation.copy(headNode.rotation);
        }

        // Update animations based on movement
        if (isMoving && !isJumping) {
            actions['walking'].play();
            actions['idle'].stop();
        } else if (!isMoving && !isJumping) {
            actions['walking'].stop();
            actions['idle'].play();
        }

        setIsMoving(isMoving || isJumping); // Update moving state including jump
    });

    useEffect(() => {
        if (isOpen) return;
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isOpen]);

    return <AvatarModel nodes={nodes} group={group} materials={materials} />;
}

useGLTF.preload('/models/Avatar.glb');

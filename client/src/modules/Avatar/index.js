import React, { useEffect, useMemo, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useGraph, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarModel } from './AvatarModel';
import { SkeletonUtils } from 'three-stdlib';
import { useSelector } from 'react-redux';
import { playerMovement } from '@/components/WebSocketClient';

export function Avatar({ group, setIsMoving, isFirstPerson, isOpen }) {
    const { user } = useSelector((state) => state.user);
    const { scene, materials, animations } = useGLTF('/models/Avatar.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const { actions, mixer } = useAnimations(animations, group);
    const [keys, setKeys] = useState({});
    const [isJumping, setIsJumping] = useState(false);
    const [velocityY, setVelocityY] = useState(0);
    const [animation, setAnimation] = useState('idle');
    const { camera } = useThree();

    const speed = 0.01;
    const rotationSpeed = 0.05;
    const jumpSpeed = 0.2;
    const gravity = 0.02;

    useEffect(() => {
        clone.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, []);
    const handleKeyDown = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }));
    };

    useEffect(() => {
        if (isOpen) return;
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isOpen]);

    useEffect(() => {
        actions[animation].reset().fadeIn(0.32).play();
        return () => actions[animation]?.fadeOut(0.32);
    }, [animation]);

    async function movement(movementData) {
        await playerMovement(movementData)
    }

    useFrame(() => {
        if (isOpen) return;

        const direction = new THREE.Vector3();
        const headNode = nodes['mixamorigHead'];

        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        let isMoving = false;

        if (!isJumping) {
            if (keys['ArrowUp'] || keys['KeyW']) {
                group.current.position.add(direction.clone().normalize().multiplyScalar(speed));
                isMoving = true;
            }

            if (keys['ArrowDown'] || keys['KeyS']) {
                group.current.position.add(direction.clone().normalize().multiplyScalar(-speed));
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

        if (keys['Space'] && !isJumping) {
            setIsJumping(true);
            setAnimation('jump')
            setVelocityY(jumpSpeed);
        }

        if (isJumping) {
            group.current.position.y += velocityY;
            setVelocityY((v) => v - gravity);

            if (group.current.position.y <= 0) {
                group.current.position.y = 0;
                setIsJumping(false);
                setVelocityY(0);
            }
        }

        if (headNode && isFirstPerson) {
            const headPosition = new THREE.Vector3();
            headNode.getWorldPosition(headPosition);
            camera.position.copy(headPosition);
            camera.rotation.copy(headNode.rotation);
        }

        if (isMoving && !isJumping) {
            setAnimation('walking')
        } else if (!isMoving && !isJumping) {
            setAnimation('idle')
        }

        if (user && group.current)
            setTimeout(() => {
                movement({
                    roomId: user?.roomId,
                    userId: user?.id,
                    position: group.current.position,
                    rotation: group.current.rotation.y,
                    isJumping,
                    isMoving
                })
            }, 1000)

        setIsMoving(isMoving || isJumping);
    });

    return (
        <AvatarModel
            nodes={nodes}
            group={group}
            materials={materials}
            hairColor={user?.avatar?.hairColor}
            shirtColor={user?.avatar?.shirtColor}
            pantColor={user?.avatar?.pantColor}
            shoesColor={user?.avatar?.shoesColor}
        />
    );
}

useGLTF.preload('/models/Avatar.glb');

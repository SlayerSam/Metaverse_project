import React, { useEffect, useMemo, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, useGraph, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FemaleModel, MaleModel } from './AvatarModel';
import { SkeletonUtils } from 'three-stdlib';
import { useSelector } from 'react-redux';
import { playerMovement } from '@/components/WebSocketClient';


const MaleAvatar = ({ group, setIsMoving, isFirstPerson, isOpen, modelPath, avatar, checkCollisions }) => {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    const { user } = useSelector((state) => state.user);
    const { scene, materials, animations } = useGLTF(modelPath);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const { actions, mixer } = useAnimations(animations, group);
    const [keys, setKeys] = useState({});
    const [isJumping, setIsJumping] = useState(false);
    const [velocityY, setVelocityY] = useState(0);
    const [animation, setAnimation] = useState('idle');
    const { camera } = useThree();

    const speed = 0.03;
    const rotationSpeed = 0.02;
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

        const headNode = nodes['mixamorigHead'];
        const direction = new THREE.Vector3();
        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        let isMoving = false;
        const moveVector = new THREE.Vector3();

        if (!isJumping) {
            if (keys['ArrowUp'] || keys['KeyW']) {
                moveVector.add(direction.clone().multiplyScalar(speed));
            }

            if (keys['ArrowDown'] || keys['KeyS']) {
                moveVector.add(direction.clone().multiplyScalar(-speed));
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

        const nextPosition = group.current.position.clone().add(moveVector);

        // 💥 Only apply movement if no collision
        if (!checkCollisions || !checkCollisions(nextPosition)) {
            group.current.position.copy(nextPosition);
            isMoving = moveVector.length() > 0;
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
                    position: group.current?.position,
                    rotation: group.current?.rotation.y,
                    isJumping,
                    isMoving
                })
            }, 1000)

        setIsMoving(isMoving || isJumping);
    });
    console.log(nodes)

    return (
        <MaleModel
            nodes={nodes}
            group={group}
            materials={materials}
            hairColor={avatar?.hairColor}
            shirtColor={avatar?.shirtColor}
            pantColor={avatar?.pantColor}
            shoesColor={avatar?.shoesColor}
            armLength={avatar?.arm_length}
            armWidth={avatar?.arm_width}
            legLength={avatar?.leg_length}
            legWidth={avatar?.leg_width}
        />
    );
}

const FemaleAvatar = ({ group, setIsMoving, isFirstPerson, isOpen, modelPath, avatar, checkCollisions }) => {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    const { user } = useSelector((state) => state.user);
    const { scene, materials, animations } = useGLTF(modelPath);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);
    const { actions, mixer } = useAnimations(animations, group);
    const [keys, setKeys] = useState({});
    const [isJumping, setIsJumping] = useState(false);
    const [velocityY, setVelocityY] = useState(0);
    const [animation, setAnimation] = useState('idle');
    const { camera } = useThree();

    const speed = 0.03;
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


        const headNode = nodes['mixamorigHead'];
        const direction = new THREE.Vector3();
        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        let isMoving = false;
        const moveVector = new THREE.Vector3();

        if (!isJumping) {
            if (keys['ArrowUp'] || keys['KeyW']) {
                moveVector.add(direction.clone().multiplyScalar(speed));
            }

            if (keys['ArrowDown'] || keys['KeyS']) {
                moveVector.add(direction.clone().multiplyScalar(-speed));
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

        const nextPosition = group.current.position.clone().add(moveVector);

        // 💥 Only apply movement if no collision
        if (!checkCollisions || !checkCollisions(nextPosition)) {
            group.current.position.copy(nextPosition);
            isMoving = moveVector.length() > 0;
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
        <FemaleModel
            nodes={nodes}
            group={group}
            materials={materials}
            hairColor={avatar?.hairColor}
            shirtColor={avatar?.shirtColor}
            pantColor={avatar?.pantColor}
            shoesColor={avatar?.shoesColor}
            armLength={avatar?.arm_length}
            armWidth={avatar?.arm_width}
            legLength={avatar?.leg_length}
            legWidth={avatar?.leg_width}
        />
    );
}


export function Avatar({ group, setIsMoving, isFirstPerson, isOpen, avatar, checkCollisions }) {
    if (avatar.gender == 'male') {
        return <MaleAvatar group={group} setIsMoving={setIsMoving} checkCollisions={checkCollisions} isFirstPerson={isFirstPerson} isOpen={isOpen} avatar={avatar} modelPath='/models/Avatar.glb' />
    }
    else {
        return <FemaleAvatar group={group} setIsMoving={setIsMoving} checkCollisions={checkCollisions} isFirstPerson={isFirstPerson} isOpen={isOpen} avatar={avatar} modelPath='/models/Female.glb' />
    }

}


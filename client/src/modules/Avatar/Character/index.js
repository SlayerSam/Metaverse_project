import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { MaleModel } from '../AvatarModel';
import { SkeletonUtils } from 'three-stdlib';
import { useFrame, useGraph } from 'react-three-fiber';
import { getSocket } from '@/components/WebSocketClient';
import * as THREE from 'three'

export function Character({ id, hairColor, shirtColor, pantColor, shoesColor, position, isMoving, isJumping, rotation }) {
    const group = useRef(null);
    const [positionState, setPosition] = useState(position)
    const [isMovingState, setIsMoving] = useState(isMoving);
    const [rotationState, setRotation] = useState(rotation)
    const [isJumpingState, setIsJumping] = useState(isJumping);
    const [animation, setAnimation] = useState('idle');
    const { materials, scene, animations } = useGLTF('/models/Avatar.glb');
    const { actions, mixer } = useAnimations(animations, group); // Get mixer for handling events
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone)

    useEffect(() => {
        const socket = getSocket();
        socket.on('playerMovement', ({ data }) => {
            if (data?.userId == id) {
                setIsJumping(data.isJumping);
                setIsMoving(data.isMoving);
                setPosition(new THREE.Vector3(data.position.x, data.position.y, data.position.z));
                setRotation(data.rotation);
            }
        })
    }, [])


    useEffect(() => {
        actions[animation].reset().fadeIn(0.32).play();
        return () => actions[animation]?.fadeOut(0.32);
    }, [animation]);

    useFrame(() => {
        if (isMovingState && !isJumpingState) {
            setAnimation('walking');
        } else if (!isMovingState && !isJumpingState) {
            setAnimation('idle');
        }
    }, [isMovingState, isJumpingState])

    return (
        <MaleModel
            nodes={nodes}
            group={group}
            materials={materials}
            hairColor={hairColor}
            shirtColor={shirtColor}
            pantColor={pantColor}
            shoesColor={shoesColor}
            position={positionState}
            rotation={rotationState}
        />
    );
}

useGLTF.preload('/models/Avatar.glb');

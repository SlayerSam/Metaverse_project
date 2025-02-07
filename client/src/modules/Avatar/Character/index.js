import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Billboard, Text, useAnimations, useGLTF } from '@react-three/drei';
import { FemaleModel, MaleModel } from '../AvatarModel';
import { SkeletonUtils } from 'three-stdlib';
import { useFrame, useGraph } from 'react-three-fiber';
import { getSocket } from '@/components/WebSocketClient';
import * as THREE from 'three'

export function Character({ id, hairColor, shirtColor, pantColor, shoesColor, position, isMoving, isJumping, rotation, gender, armWidth, armLength, legWidth, legLength }) {
    const [positionState, setPosition] = useState(position)
    const [isMovingState, setIsMoving] = useState(isMoving);
    const [rotationState, setRotation] = useState(rotation)
    const [isJumpingState, setIsJumping] = useState(isJumping);

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
    return (
        < Suspense >
            <group position={positionState}>
                <Billboard position={[positionState.x,positionState.y + 1.8 , positionState.z]}>
                    <Text
                        fontSize={0.1}
                        color="white"
                        anchorX="center"
                        anchorY="bottom"
                    >
                        Avatar Name
                    </Text>
                </Billboard>
                {gender === "male" ? (
                    <MaleAvatar
                        id={id}
                        hairColor={hairColor}
                        shirtColor={shirtColor}
                        pantColor={pantColor}
                        shoesColor={shoesColor}
                        positionState={positionState}
                        isMovingState={isMovingState}
                        isJumpingState={isJumpingState}
                        rotationState={rotationState}
                        armWidth={armWidth}
                        armLength={armLength}
                        legWidth={legWidth}
                        legLength={legLength}
                        modelPath={'/models/Avatar.glb'}
                    />
                ) : (
                    <FemaleAvatar
                        id={id}
                        hairColor={hairColor}
                        shirtColor={shirtColor}
                        pantColor={pantColor}
                        shoesColor={shoesColor}
                        positionState={positionState}
                        isMovingState={isMovingState}
                        isJumpingState={isJumpingState}
                        rotationState={rotationState}
                        armWidth={armWidth}
                        armLength={armLength}
                        legWidth={legWidth}
                        legLength={legLength}
                        modelPath={'/models/Female.glb'}
                    />
                )}
            </group>
        </Suspense >
    )
}


const MaleAvatar = ({ id, hairColor, shirtColor, pantColor, shoesColor, positionState, isMovingState, isJumpingState, rotationState, modelPath, armLength, armWidth, legLength, legWidth }) => {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    const group = useRef(null);
    const [animation, setAnimation] = useState('idle');
    const { materials, scene, animations } = useGLTF(modelPath);
    const { actions, mixer } = useAnimations(animations, group); // Get mixer for handling events
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone)

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
            armLength={armLength}
            armWidth={armWidth}
            legLength={legLength}
            legWidth={legWidth}
        />
    );
}
const FemaleAvatar = ({ id, hairColor, shirtColor, pantColor, shoesColor, positionState, isMovingState, isJumpingState, rotationState, modelPath, armWidth, armLength, legLength, legWidth }) => {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    const group = useRef(null);
    const [animation, setAnimation] = useState('idle');
    const { materials, scene, animations } = useGLTF(modelPath);
    const { actions, mixer } = useAnimations(animations, group); // Get mixer for handling events
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone)

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
        <FemaleModel
            nodes={nodes}
            group={group}
            materials={materials}
            hairColor={hairColor}
            shirtColor={shirtColor}
            pantColor={pantColor}
            shoesColor={shoesColor}
            position={positionState}
            rotation={rotationState}
            armLength={armLength}
            armWidth={armWidth}
            legLength={legLength}
            legWidth={legWidth}
        />
    );
}
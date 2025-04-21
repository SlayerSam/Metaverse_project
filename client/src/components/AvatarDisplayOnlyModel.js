'use client';

import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGLTF, useAnimations, OrbitControls } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useFrame, useGraph } from 'react-three-fiber';
import * as THREE from 'three';
import { getMouseDegrees } from '@/utils/MousePosition';
import { FemaleModel, MaleModel } from '@/modules/Avatar/AvatarModel';

export default function AvatarDisplayModelOnly({
    modelPath,
    avatar,
}) {
    const group = useRef();
    const { scene, materials, animations } = useGLTF(modelPath);
    const { actions } = useAnimations(animations, group);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const moveJoint = useCallback((mouse, joint, degreeLimit) => {
        const degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const mouseCoords = { x: e.clientX, y: e.clientY };
        if (nodes?.["mixamorigHead"]) {
            moveJoint(mouseCoords, nodes["mixamorigHead"], 50);
        }
    }, [nodes, moveJoint]);

    // Play animation when idle action is available
    useEffect(() => {
        if (actions?.idle) {
            actions.idle.reset().fadeIn(0.3).play();
        }
    }, [actions]);

    // Add mouse move event listener and cleanup on unmount
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    if (avatar.gender == 'male') {
        return (
            <group position={[0, -1, 0]}>
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
                    display={true}
                />
            </group>
        );
    }
    else {
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
                display={true}
            />
        )
    }
}

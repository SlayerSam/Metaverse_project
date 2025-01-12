import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { FemaleModel, MaleModel } from '../AvatarModel';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { getMouseDegrees } from '@/utils/MousePosition';
import * as THREE from 'three';
import { useGraph } from 'react-three-fiber';
import { SkeletonUtils } from 'three-stdlib';


function Male({
    form, modelPath
}) {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    console.log(modelPath)
    const group = useRef();
    const { scene, materials, animations } = useGLTF(modelPath);
    const { actions } = useAnimations(animations, group);
    const [position, setPosition] = useState([0, -2.8, 0]);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const armWidth = form.watch('arm_width');
    const armLength = form.watch('arm_length');
    const legWidth = form.watch('leg_width');
    const legLength = form.watch('leg_length');

    const moveJoint = useCallback((mouse, joint, degreeLimit) => {
        const degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const mouseCoords = { x: e.clientX, y: e.clientY };
        if (nodes && nodes["mixamorigHead"]) {
            console.log(nodes)
            moveJoint(mouseCoords, nodes["mixamorigHead"], 50);
        }
    }, [nodes, moveJoint]);

    useEffect(() => {
        if (actions?.idle)
            actions?.idle?.reset().fadeIn(0.32).play();
    }, [actions, modelPath]);

    useEffect(() => {
        if (nodes && armWidth && armLength) {
            if (nodes['mixamorigLeftArm']) {
                nodes['mixamorigLeftArm'].scale.set(armWidth, armLength, armWidth);
                nodes['mixamorigRightArm'].scale.set(armWidth, armLength, armWidth);
            }
        }
        if (nodes && legWidth && legLength) {
            if (nodes['mixamorigLeftLeg']) {
                const legOffset = (legLength - 1) * 4;
                nodes['mixamorigLeftLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigLeftUpLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigRightLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigRightUpLeg'].scale.set(legWidth, legLength, legWidth);
                setPosition([0, -2.8 + legOffset, 0]);
            }
        }
    }, [nodes, armWidth, armLength, legWidth, legLength]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            console.log('remove')
            window.removeEventListener('mousemove', handleMouseMove)
        };
    }, [handleMouseMove]);
    return (
        <MaleModel
            group={group}
            nodes={nodes}
            scale={3}
            hairColor={form.watch('hairColor')}
            shirtColor={form.watch('shirtColor')}
            pantColor={form.watch('pantColor')}
            shoesColor={form.watch('shoesColor')}
            armWidthScale={form.watch('left_arm')}
            materials={materials}
            position={position}
            key={'display'}
        />
    )
}

function Female({
    form, modelPath
}) {
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    console.log(modelPath)
    const group = useRef();
    const { scene, materials, animations } = useGLTF(modelPath);
    const { actions } = useAnimations(animations, group);
    const [position, setPosition] = useState([0, -2.8, 0]);
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone);

    const armWidth = form.watch('arm_width');
    const armLength = form.watch('arm_length');
    const legWidth = form.watch('leg_width');
    const legLength = form.watch('leg_length');

    const moveJoint = useCallback((mouse, joint, degreeLimit) => {
        const degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }, []);

    const handleMouseMove = useCallback((e) => {
        console.log('moved')
        const mouseCoords = { x: e.clientX, y: e.clientY };
        if (nodes && nodes["mixamorig2Head"]) {
            console.log(nodes['mixamorig2Head'])
            moveJoint(mouseCoords, nodes["mixamorig2Head"], 50);
        }
    }, [nodes, moveJoint]);

    useEffect(() => {
        if (actions?.idle)
            actions?.idle?.reset().fadeIn(0.32).play();
    }, [actions, modelPath]);

    useEffect(() => {
        if (nodes && armWidth && armLength) {
            if (nodes['mixamorig2LeftArm']) {
                nodes['mixamorig2LeftArm'].scale.set(armWidth, armLength, armWidth);
                nodes['mixamorig2RightArm'].scale.set(armWidth, armLength, armWidth);
            }

        }
        if (nodes && legWidth && legLength) {
            if (nodes['mixamorig2LeftLeg']) {
                const legOffset = (legLength - 1) * 4;
                nodes['mixamorig2LeftLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorig2LeftUpLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorig2RightLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorig2RightUpLeg'].scale.set(legWidth, legLength, legWidth);
                setPosition([0, -2.8 + legOffset, 0]);
            }
        }
    }, [nodes, armWidth, armLength, legWidth, legLength]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            console.log('remove')
            window.removeEventListener('mousemove', handleMouseMove)
        };
    }, [handleMouseMove]);
    return (
        <FemaleModel
            group={group}
            nodes={nodes}
            scale={3}
            hairColor={form.watch('hairColor')}
            shirtColor={form.watch('shirtColor')}
            pantColor={form.watch('pantColor')}
            shoesColor={form.watch('shoesColor')}
            armWidthScale={form.watch('left_arm')}
            materials={materials}
            position={position}
            key={'display'}
        />
    )
}

export default function AvatarDisplay({ form, modelPath }) {
    return (
        <>
            {
                form.watch('gender') == 'male' ?
                    (
                        <Male modelPath={modelPath} form={form} />
                    )
                    :
                    (
                        <Female modelPath={modelPath} form={form} />
                    )
            }
            <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.3, 0.3, 0.3]} receiveShadow castShadow>
                <circleGeometry args={[5, 32]} />
                <meshStandardMaterial color='lightgray' />
            </mesh>
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        </>
    );
}
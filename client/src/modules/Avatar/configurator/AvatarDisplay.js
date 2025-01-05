import React, { useEffect, useMemo, useRef } from 'react';
import { AvatarModel } from '../AvatarModel';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { getMouseDegrees } from '@/utils/MousePosition';
import * as THREE from 'three';
import { useGraph } from 'react-three-fiber';
import { SkeletonUtils } from 'three-stdlib';

export default function AvatarDisplay({ form }) {
    const group = useRef();
    const { scene, materials, animations } = useGLTF('/models/Avatar.glb');
    const { actions } = useAnimations(animations, group)
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes } = useGraph(clone)

    function moveJoint(mouse, joint, degreeLimit) {
        let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }

    function getMousePos(e) {
        return { x: e.clientX, y: e.clientY };
    }
    console.log(nodes)
    console.log(nodes['mixamorigLeftArm'].scale)


    useEffect(() => {
        actions['idle'].reset().fadeIn(0.32).play()
    }, [nodes])

    useEffect(() => {
        if (nodes && form.watch('arm_width') && form.watch('arm_length')) {
            if (nodes['mixamorigLeftHand']) {
                nodes['mixamorigLeftArm'].scale.set(form.watch('arm_width'), form.watch('arm_length'), form.watch('arm_width'));
                nodes['mixamorigRightArm'].scale.set(form.watch('arm_width'), form.watch('arm_length'), form.watch('arm_width'));
            }
            console.log(`Left Hand Scale: ${nodes['mixamorigLeftHand'].scale}`);
        }
        if (typeof window !== 'undefined') {
            const handleMouseMove = (e) => {
                const mouseCoords = getMousePos(e);
                if (nodes && nodes["mixamorigHead"]) {
                    moveJoint(mouseCoords, nodes["mixamorigHead"], 50);
                }
            };
            window.addEventListener('mousemove', handleMouseMove);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }
    }, [nodes, form.watch('arm_width') , form.watch('arm_length')]);

    return (
        <>
            <AvatarModel
                group={group}
                nodes={nodes}
                scale={3}
                hairColor={form.watch('hairColor')}
                shirtColor={form.watch('shirtColor')}
                pantColor={form.watch('pantColor')}
                shoesColor={form.watch('shoesColor')}
                armWidthScale={form.watch('left_arm')}
                materials={materials}
                position={[0, -2.8, 0]}
                key={'display'}
            />
            <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.3, 0.3, 0.3]} receiveShadow castShadow>
                <circleGeometry args={[5, 32]} />
                <meshStandardMaterial color='lightgray' />
            </mesh>
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
        </>
    );
}

useGLTF.preload('/models/Avatar.glb');

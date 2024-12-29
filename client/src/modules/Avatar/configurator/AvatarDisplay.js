import React, { useEffect, useRef } from 'react';
import { AvatarModel } from '../AvatarModel';
import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { getMouseDegrees } from '@/utils/MousePosition';
import * as THREE from 'three';

export default function AvatarDisplay({ form }) {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF('/models/Avatar.glb');
    const { actions } = useAnimations(animations, group)

    function moveJoint(mouse, joint, degreeLimit) {
        let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }

    function getMousePos(e) {
        return { x: e.clientX, y: e.clientY };
    }

    useEffect(() => {
        actions['idle'].play()
        const handleMouseMove = (e) => {
            const mouseCoords = getMousePos(e);
            if (nodes && nodes["mixamorigHead"]) {
                moveJoint(mouseCoords, nodes["mixamorigHead"], 50);
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [nodes]); // Add nodes to the dependency array

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
                position={[0, -2.8,0]}
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

import React, { useEffect, useRef } from 'react'
import { AvatarModel } from '../AvatarModel'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'
import { getMouseDegrees } from '@/utils/MousePosition'
import * as THREE from 'three'

export default function AvatarDisplay({ form }) {
    const { nodes, materials } = useGLTF('/models/Avatar.glb')
    const group = useRef()

    function moveJoint(mouse, joint, degreeLimit) {
        let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
        joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
        joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
    }
    useEffect(() => {
        document.addEventListener('mousemove', function (e) {
            var mousecoords = getMousePos(e);
            console.log(nodes)
            if (nodes['mixamorig1Head'] && nodes['mixamorig1Spine']) {
                moveJoint(mousecoords, nodes['mixamorig1Head'], 50);
                moveJoint(mousecoords, nodes['mixamorig1Spine'], 30);
            }
        });
        return () => {
            document.removeEventListener('mousemove', null);
        }
    }, [])

    function getMousePos(e) {
        return { x: e.clientX, y: e.clientY };
    }
    return (
        <>
            <AvatarModel group={group} nodes={nodes} scale={[2, 2, 2]} color={form.watch('color')} armWidthScale={form.watch('left_arm')} materials={materials} position={[0, -2.8, 0]} />
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
    )
}
useGLTF.preload('/models/Avatar.glb')
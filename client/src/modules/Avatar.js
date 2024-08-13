import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

export function Avatar({ group }) {
    const { nodes, materials, animations } = useGLTF('/models/Avatar.glb')
    const { actions } = useAnimations(animations, group)
    const [isClick, setClick] = useState(false)
    const [keys, setKeys] = useState({})

    const speed = 0.1
    const rotationSpeed = 0.05;

    const handleKeyDown = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }))
    }

    const handleKeyUp = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }))
    }

    useFrame(() => {
        let isMoving = false
        const direction = new THREE.Vector3();
        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize()
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
            isMoving = true
        }

        if (keys['ArrowRight'] || keys['KeyD']) {
            group.current.rotation.y -= rotationSpeed;
            isMoving = true
        }

        if (isMoving) {
            actions['Walking']?.play()
            actions['Rest']?.stop()
        } else {
            actions['Walking']?.stop()
            actions['Rest']?.play()
        }
    })

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isClick]);
    return (
        <group ref={group} dispose={null}>
            <group name="Scene">
                <group name="metarig">
                    <primitive object={nodes.spine} />
                </group>
                <group name="rig">
                    <skinnedMesh
                        name="Ch36"
                        geometry={nodes.Ch36.geometry}
                        material={nodes.Ch36.material}
                        skeleton={nodes.Ch36.skeleton}
                    />
                    <primitive object={nodes.root} />
                    <primitive object={nodes['MCH-torsoparent']} />
                    <primitive object={nodes['MCH-hand_ikparentL']} />
                    <primitive object={nodes['MCH-upper_arm_ik_targetparentL']} />
                    <primitive object={nodes['MCH-hand_ikparentR']} />
                    <primitive object={nodes['MCH-upper_arm_ik_targetparentR']} />
                    <primitive object={nodes['MCH-foot_ikparentL']} />
                    <primitive object={nodes['MCH-thigh_ik_targetparentL']} />
                    <primitive object={nodes['MCH-foot_ikparentR']} />
                    <primitive object={nodes['MCH-thigh_ik_targetparentR']} />
                </group>
                <group
                    name="WGT-rig_spine_fk"
                    position={[0, 1.78, -0.04]}
                    rotation={[1.82, 0, 0]}
                    scale={0.26}
                />
                <group
                    name="WGT-rig_spine_fk001"
                    position={[0, 2.01, -0.01]}
                    rotation={[1.69, 0, 0]}
                    scale={0.23}
                />
                <group
                    name="WGT-rig_spine_fk002"
                    position={[0, 2.01, -0.01]}
                    rotation={[1.54, 0, 0]}
                    scale={0.29}
                />
                <group
                    name="WGT-rig_spine_fk003"
                    position={[0, 2.3, -0.02]}
                    rotation={[1.54, 0, 0]}
                    scale={0.32}
                />
                <group
                    name="WGT-rig_tweak_spine"
                    position={[0, 1.54, -0.1]}
                    rotation={[1.82, 0, 0]}
                    scale={0.13}
                />
                <group
                    name="WGT-rig_tweak_spine001"
                    position={[0, 1.78, -0.04]}
                    rotation={[1.69, 0, 0]}
                    scale={0.12}
                />
                <group
                    name="WGT-rig_tweak_spine002"
                    position={[0, 2.01, -0.01]}
                    rotation={[1.54, 0, 0]}
                    scale={0.15}
                />
                <group
                    name="WGT-rig_tweak_spine003"
                    position={[0, 2.3, -0.02]}
                    rotation={[1.54, 0, 0]}
                    scale={0.16}
                />
                <group
                    name="WGT-rig_tweak_spine004"
                    position={[0, 2.63, -0.03]}
                    rotation={[1.95, 0, 0]}
                    scale={0.06}
                />
                <group name="WGT-rig_torso" position={[0, 1.66, -0.07]} scale={0.66} />
                <group
                    name="WGT-rig_hips"
                    position={[0, 1.54, -0.1]}
                    rotation={[1.82, 0, 0]}
                    scale={0.28}
                />
                <group
                    name="WGT-rig_chest"
                    position={[0, 2.3, -0.02]}
                    rotation={[1.54, 0, 0]}
                    scale={0.37}
                />
                <group
                    name="WGT-rig_shoulderL"
                    position={[0.03, 2.54, 0.11]}
                    rotation={[0, -1.04, 0]}
                    scale={0.3}
                />
                <group
                    name="WGT-rig_upper_arm_parentL"
                    position={[0.35, 2.53, -0.07]}
                    rotation={[0.03, -1.54, -1.49]}
                    scale={0.12}
                />
                <group
                    name="WGT-rig_upper_arm_fkL"
                    position={[0.35, 2.53, -0.07]}
                    rotation={[0.03, -1.54, -1.49]}
                    scale={0.48}
                />
                <group
                    name="WGT-rig_forearm_fkL"
                    position={[0.83, 2.53, -0.08]}
                    rotation={[3.04, -1.52, 1.53]}
                    scale={0.42}
                />
                <group
                    name="WGT-rig_hand_fkL"
                    position={[1.25, 2.53, -0.06]}
                    rotation={[-2.88, -1.41, 1.89]}
                    scale={0.13}
                />
                <group
                    name="WGT-rig_upper_arm_ikL"
                    position={[0.35, 2.53, -0.07]}
                    rotation={[0.03, -1.54, -1.49]}
                    scale={0.48}
                />
                <group
                    name="WGT-rig_upper_arm_ik_targetL"
                    position={[0.83, 2.47, -0.98]}
                    rotation={[3.08, 0.01, -0.34]}
                    scale={0.11}
                />
                <group
                    name="WGT-rig_hand_ikL"
                    position={[1.25, 2.53, -0.06]}
                    rotation={[-2.88, -1.41, 1.89]}
                    scale={0.13}
                />
                <group
                    name="WGT-rig_VIS_upper_arm_ik_poleL"
                    position={[0.83, 2.53, -0.08]}
                    rotation={[Math.PI / 2, 0, -1.51]}
                    scale={0.9}
                />
                <group
                    name="WGT-rig_upper_arm_tweakL"
                    position={[0.35, 2.53, -0.07]}
                    rotation={[0.03, -1.54, -1.49]}
                    scale={0.12}
                />
                <group
                    name="WGT-rig_upper_arm_tweakL001"
                    position={[0.59, 2.53, -0.08]}
                    rotation={[0.03, -1.54, -1.49]}
                    scale={0.12}
                />
                <group
                    name="WGT-rig_forearm_tweakL"
                    position={[0.83, 2.53, -0.08]}
                    rotation={[3.04, -1.52, 1.53]}
                    scale={0.11}
                />
                <group
                    name="WGT-rig_forearm_tweakL001"
                    position={[1.04, 2.53, -0.07]}
                    rotation={[3.04, -1.52, 1.53]}
                    scale={0.11}
                />
                <group
                    name="WGT-rig_hand_tweakL"
                    position={[1.25, 2.53, -0.06]}
                    rotation={[-2.88, -1.41, 1.89]}
                    scale={0.03}
                />
                <group
                    name="WGT-rig_palmL"
                    position={[1.31, 2.53, -0.09]}
                    rotation={[0.91, -1.39, 0.77]}
                    scale={0.1}
                />
                <group
                    name="WGT-rig_f_index01L"
                    position={[1.42, 2.53, 0.02]}
                    rotation={[-2.25, -1.29, 0.45]}
                    scale={0.07}
                />
                <group
                    name="WGT-rig_f_index02L"
                    position={[1.49, 2.51, 0.03]}
                    rotation={[-1.79, -1.25, 0.89]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_index03L"
                    position={[1.53, 2.5, 0.04]}
                    rotation={[-1.85, -1.12, 0.84]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_index01L001"
                    position={[1.58, 2.48, 0.04]}
                    rotation={[1.29, 1.12, 1.34]}
                    scale={0.03}
                />
                <group
                    name="WGT-rig_f_index01_masterL"
                    position={[1.42, 2.53, 0.02]}
                    rotation={[-2.25, -1.29, 0.45]}
                    scale={0.29}
                />
                <group
                    name="WGT-rig_thumb01L"
                    position={[1.29, 2.5, -0.01]}
                    rotation={[-2.67, -0.62, -1.02]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_thumb02L"
                    position={[1.32, 2.48, 0.03]}
                    rotation={[-2.37, -0.86, -0.82]}
                    scale={0.06}
                />
                <group
                    name="WGT-rig_thumb03L"
                    position={[1.37, 2.46, 0.06]}
                    rotation={[-2.23, -1.02, -0.7]}
                    scale={0.07}
                />
                <group
                    name="WGT-rig_thumb01L001"
                    position={[1.42, 2.43, 0.08]}
                    rotation={[0.91, 1.02, 0.47]}
                    scale={0.03}
                />
                <group
                    name="WGT-rig_thumb01_masterL"
                    position={[1.29, 2.5, -0.01]}
                    rotation={[-2.67, -0.62, -1.02]}
                    scale={0.27}
                />
                <group
                    name="WGT-rig_f_middle01L"
                    position={[1.44, 2.54, -0.02]}
                    rotation={[-1.96, -1.32, -3.08]}
                    scale={0.07}
                />
                <group
                    name="WGT-rig_f_middle02L"
                    position={[1.51, 2.52, -0.02]}
                    rotation={[-1.88, -1.33, -3]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_middle03L"
                    position={[1.55, 2.51, -0.01]}
                    rotation={[-2.25, -1.3, 2.92]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_middle01L001"
                    position={[1.59, 2.5, -0.01]}
                    rotation={[0.89, 1.3, -2.04]}
                    scale={0.02}
                />
                <group
                    name="WGT-rig_f_middle01_masterL"
                    position={[1.44, 2.54, -0.02]}
                    rotation={[-1.96, -1.32, -3.08]}
                    scale={0.28}
                />
                <group
                    name="WGT-rig_f_ring01L"
                    position={[1.44, 2.53, -0.06]}
                    rotation={[-1.3, -1.34, 2.28]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_ring02L"
                    position={[1.49, 2.52, -0.07]}
                    rotation={[-1.52, -1.32, 2.06]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_ring03L"
                    position={[1.53, 2.51, -0.07]}
                    rotation={[-1.51, -1.2, 2.07]}
                    scale={0.04}
                />
                <group
                    name="WGT-rig_f_ring01L001"
                    position={[1.58, 2.49, -0.07]}
                    rotation={[1.64, 1.2, 1.95]}
                    scale={0.02}
                />
                <group
                    name="WGT-rig_f_ring01_masterL"
                    position={[1.44, 2.53, -0.06]}
                    rotation={[-1.3, -1.34, 2.28]}
                    scale={0.22}
                />
                <group
                    name="WGT-rig_f_pinky01L"
                    position={[1.42, 2.54, -0.1]}
                    rotation={[-1.28, -1.34, 1.86]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_f_pinky02L"
                    position={[1.46, 2.53, -0.1]}
                    rotation={[-1.4, -1.25, 1.74]}
                    scale={0.04}
                />
                <group
                    name="WGT-rig_f_pinky03L"
                    position={[1.5, 2.52, -0.11]}
                    rotation={[-1.43, -1, 1.71]}
                    scale={0.04}
                />
                <group
                    name="WGT-rig_f_pinky01L001"
                    position={[1.53, 2.5, -0.11]}
                    rotation={[1.72, 1, 1.47]}
                    scale={0.02}
                />
                <group
                    name="WGT-rig_f_pinky01_masterL"
                    position={[1.42, 2.54, -0.1]}
                    rotation={[-1.28, -1.34, 1.86]}
                    scale={0.2}
                />
                <group
                    name="WGT-rig_shoulderR"
                    position={[-0.03, 2.54, 0.11]}
                    rotation={[3.14, -1.04, 0]}
                    scale={-0.3}
                />
                <group
                    name="WGT-rig_upper_arm_parentR"
                    position={[-0.35, 2.53, -0.07]}
                    rotation={[-3.12, -1.54, -1.49]}
                    scale={-0.12}
                />
                <group
                    name="WGT-rig_upper_arm_fkR"
                    position={[-0.35, 2.53, -0.07]}
                    rotation={[-3.12, -1.54, -1.49]}
                    scale={-0.48}
                />
                <group
                    name="WGT-rig_forearm_fkR"
                    position={[-0.83, 2.53, -0.08]}
                    rotation={[-0.1, -1.52, 1.53]}
                    scale={-0.42}
                />
                <group
                    name="WGT-rig_hand_fkR"
                    position={[-1.25, 2.53, -0.06]}
                    rotation={[0.26, -1.41, 1.89]}
                    scale={-0.13}
                />
                <group
                    name="WGT-rig_upper_arm_ikR"
                    position={[-0.35, 2.53, -0.07]}
                    rotation={[-3.12, -1.54, -1.49]}
                    scale={-0.48}
                />
                <group
                    name="WGT-rig_upper_arm_ik_targetR"
                    position={[-0.83, 2.47, -0.98]}
                    rotation={[-0.06, 0.01, -0.34]}
                    scale={-0.11}
                />
                <group
                    name="WGT-rig_hand_ikR"
                    position={[-1.25, 2.53, -0.06]}
                    rotation={[0.26, -1.41, 1.89]}
                    scale={-0.13}
                />
                <group
                    name="WGT-rig_VIS_upper_arm_ik_poleR"
                    position={[-0.83, 2.53, -0.08]}
                    rotation={[-Math.PI / 2, 0, -1.51]}
                    scale={-0.9}
                />
                <group
                    name="WGT-rig_upper_arm_tweakR"
                    position={[-0.35, 2.53, -0.07]}
                    rotation={[-3.12, -1.54, -1.49]}
                    scale={-0.12}
                />
                <group
                    name="WGT-rig_upper_arm_tweakR001"
                    position={[-0.59, 2.53, -0.08]}
                    rotation={[-3.12, -1.54, -1.49]}
                    scale={-0.12}
                />
                <group
                    name="WGT-rig_forearm_tweakR"
                    position={[-0.83, 2.53, -0.08]}
                    rotation={[-0.1, -1.52, 1.53]}
                    scale={-0.11}
                />
                <group
                    name="WGT-rig_forearm_tweakR001"
                    position={[-1.04, 2.53, -0.07]}
                    rotation={[-0.1, -1.52, 1.53]}
                    scale={-0.11}
                />
                <group
                    name="WGT-rig_hand_tweakR"
                    position={[-1.25, 2.53, -0.06]}
                    rotation={[0.26, -1.41, 1.89]}
                    scale={-0.03}
                />
                <group
                    name="WGT-rig_palmR"
                    position={[-1.31, 2.53, -0.09]}
                    rotation={[-2.23, -1.39, 0.77]}
                    scale={-0.1}
                />
                <group
                    name="WGT-rig_f_index01R"
                    position={[-1.42, 2.53, 0.02]}
                    rotation={[0.89, -1.29, 0.45]}
                    scale={-0.07}
                />
                <group
                    name="WGT-rig_f_index02R"
                    position={[-1.49, 2.51, 0.03]}
                    rotation={[1.35, -1.25, 0.89]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_index03R"
                    position={[-1.53, 2.5, 0.04]}
                    rotation={[1.29, -1.12, 0.84]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_index01R001"
                    position={[-1.58, 2.48, 0.04]}
                    rotation={[-1.85, 1.12, 1.34]}
                    scale={-0.03}
                />
                <group
                    name="WGT-rig_f_index01_masterR"
                    position={[-1.42, 2.53, 0.02]}
                    rotation={[0.89, -1.29, 0.45]}
                    scale={-0.29}
                />
                <group
                    name="WGT-rig_thumb01R"
                    position={[-1.29, 2.5, -0.01]}
                    rotation={[0.47, -0.62, -1.02]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_thumb02R"
                    position={[-1.32, 2.48, 0.03]}
                    rotation={[0.77, -0.86, -0.82]}
                    scale={-0.06}
                />
                <group
                    name="WGT-rig_thumb03R"
                    position={[-1.37, 2.46, 0.06]}
                    rotation={[0.91, -1.02, -0.7]}
                    scale={-0.07}
                />
                <group
                    name="WGT-rig_thumb01R001"
                    position={[-1.42, 2.43, 0.08]}
                    rotation={[-2.23, 1.02, 0.47]}
                    scale={-0.03}
                />
                <group
                    name="WGT-rig_thumb01_masterR"
                    position={[-1.29, 2.5, -0.01]}
                    rotation={[0.47, -0.62, -1.02]}
                    scale={-0.27}
                />
                <group
                    name="WGT-rig_f_middle01R"
                    position={[-1.44, 2.54, -0.02]}
                    rotation={[1.18, -1.32, -3.08]}
                    scale={-0.07}
                />
                <group
                    name="WGT-rig_f_middle02R"
                    position={[-1.51, 2.52, -0.02]}
                    rotation={[1.26, -1.33, -3]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_middle03R"
                    position={[-1.55, 2.51, -0.01]}
                    rotation={[0.89, -1.3, 2.92]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_middle01R001"
                    position={[-1.59, 2.5, -0.01]}
                    rotation={[-2.25, 1.3, -2.04]}
                    scale={-0.02}
                />
                <group
                    name="WGT-rig_f_middle01_masterR"
                    position={[-1.44, 2.54, -0.02]}
                    rotation={[1.18, -1.32, -3.08]}
                    scale={-0.28}
                />
                <group
                    name="WGT-rig_f_ring01R"
                    position={[-1.44, 2.53, -0.06]}
                    rotation={[1.84, -1.34, 2.28]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_ring02R"
                    position={[-1.49, 2.52, -0.07]}
                    rotation={[1.62, -1.32, 2.06]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_ring03R"
                    position={[-1.53, 2.51, -0.07]}
                    rotation={[1.64, -1.2, 2.07]}
                    scale={-0.04}
                />
                <group
                    name="WGT-rig_f_ring01R001"
                    position={[-1.58, 2.49, -0.07]}
                    rotation={[-1.51, 1.2, 1.95]}
                    scale={-0.02}
                />
                <group
                    name="WGT-rig_f_ring01_masterR"
                    position={[-1.44, 2.53, -0.06]}
                    rotation={[1.84, -1.34, 2.28]}
                    scale={-0.22}
                />
                <group
                    name="WGT-rig_f_pinky01R"
                    position={[-1.42, 2.54, -0.1]}
                    rotation={[1.87, -1.34, 1.86]}
                    scale={-0.05}
                />
                <group
                    name="WGT-rig_f_pinky02R"
                    position={[-1.46, 2.53, -0.1]}
                    rotation={[1.74, -1.25, 1.74]}
                    scale={-0.04}
                />
                <group
                    name="WGT-rig_f_pinky03R"
                    position={[-1.5, 2.52, -0.11]}
                    rotation={[1.72, -1, 1.71]}
                    scale={-0.04}
                />
                <group
                    name="WGT-rig_f_pinky01R001"
                    position={[-1.53, 2.5, -0.11]}
                    rotation={[-1.43, 1, 1.47]}
                    scale={-0.02}
                />
                <group
                    name="WGT-rig_f_pinky01_masterR"
                    position={[-1.42, 2.54, -0.1]}
                    rotation={[1.87, -1.34, 1.86]}
                    scale={-0.2}
                />
                <group
                    name="WGT-rig_neck"
                    position={[0, 2.63, -0.03]}
                    rotation={[1.86, 0, 0]}
                    scale={0.22}
                />
                <group
                    name="WGT-rig_head"
                    position={[0, 2.83, 0.03]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.33}
                />
                <group
                    name="WGT-rig_tweak_spine005"
                    position={[0, 2.73, 0.02]}
                    rotation={[1.76, 0, 0]}
                    scale={0.05}
                />
                <group
                    name="WGT-rig_thigh_parentL"
                    position={[0.18, 1.66, 0.02]}
                    rotation={[-1.57, -0.08, 0.27]}
                    scale={0.16}
                />
                <group
                    name="WGT-rig_thigh_fkL"
                    position={[0.18, 1.66, 0.02]}
                    rotation={[-1.57, -0.08, 0.27]}
                    scale={0.66}
                />
                <group
                    name="WGT-rig_shin_fkL"
                    position={[0.24, 1.01, 0.03]}
                    rotation={[-1.45, -0.05, 0.28]}
                    scale={0.87}
                />
                <group
                    name="WGT-rig_foot_fkL"
                    position={[0.28, 0.14, -0.08]}
                    rotation={[-2.7, -0.26, 0.12]}
                    scale={0.25}
                />
                <group
                    name="WGT-rig_toe_fkL"
                    position={[0.34, 0.04, 0.14]}
                    rotation={[-Math.PI, 0, -3.14]}
                    scale={0.11}
                />
                <group
                    name="WGT-rig_thigh_ikL"
                    position={[0.18, 1.66, 0.02]}
                    rotation={[-1.57, -0.08, 0.27]}
                    scale={0.66}
                />
                <group
                    name="WGT-rig_thigh_ik_targetL"
                    position={[0.65, 0.94, 1.49]}
                    rotation={[0.05, 0.28, -0.01]}
                    scale={0.19}
                />
                <group name="WGT-rig_foot_ikL" position={[0.28, 0.14, -0.08]} scale={0.25} />
                <group
                    name="WGT-rig_VIS_thigh_ik_poleL"
                    position={[0.24, 1.01, 0.03]}
                    rotation={[Math.PI / 2, 0, 0.32]}
                    scale={1.52}
                />
                <group
                    name="WGT-rig_thigh_tweakL"
                    position={[0.18, 1.66, 0.02]}
                    rotation={[-1.57, -0.08, 0.27]}
                    scale={0.16}
                />
                <group
                    name="WGT-rig_thigh_tweakL001"
                    position={[0.21, 1.33, 0.03]}
                    rotation={[-1.57, -0.08, 0.27]}
                    scale={0.16}
                />
                <group
                    name="WGT-rig_shin_tweakL"
                    position={[0.24, 1.01, 0.03]}
                    rotation={[-1.45, -0.05, 0.28]}
                    scale={0.22}
                />
                <group
                    name="WGT-rig_shin_tweakL001"
                    position={[0.26, 0.57, -0.03]}
                    rotation={[-1.45, -0.05, 0.28]}
                    scale={0.22}
                />
                <group
                    name="WGT-rig_foot_tweakL"
                    position={[0.28, 0.14, -0.08]}
                    rotation={[-2.7, -0.26, 0.12]}
                    scale={0.06}
                />
                <group name="WGT-rig_foot_spin_ikL" position={[0.34, 0.04, 0.14]} scale={0.12} />
                <group name="WGT-rig_foot_heel_ikL" position={[0.28, 0.14, -0.08]} scale={0.12} />
                <group
                    name="WGT-rig_toe_ikL"
                    position={[0.34, 0.04, 0.14]}
                    rotation={[-Math.PI, 0, -3.14]}
                    scale={0.11}
                />
                <group
                    name="WGT-rig_thigh_parentR"
                    position={[-0.18, 1.66, 0.02]}
                    rotation={[1.57, -0.08, 0.23]}
                    scale={-0.16}
                />
                <group
                    name="WGT-rig_thigh_fkR"
                    position={[-0.18, 1.66, 0.02]}
                    rotation={[1.57, -0.08, 0.23]}
                    scale={-0.66}
                />
                <group
                    name="WGT-rig_shin_fkR"
                    position={[-0.24, 1.01, 0.03]}
                    rotation={[1.69, -0.06, 0.23]}
                    scale={-0.87}
                />
                <group
                    name="WGT-rig_foot_fkR"
                    position={[-0.28, 0.14, -0.08]}
                    rotation={[0.44, -0.24, 0.11]}
                    scale={-0.25}
                />
                <group
                    name="WGT-rig_toe_fkR"
                    position={[-0.34, 0.04, 0.14]}
                    rotation={[0, 0, 3.14]}
                    scale={-0.11}
                />
                <group
                    name="WGT-rig_thigh_ikR"
                    position={[-0.18, 1.66, 0.02]}
                    rotation={[1.57, -0.08, 0.23]}
                    scale={-0.66}
                />
                <group
                    name="WGT-rig_thigh_ik_targetR"
                    position={[-0.59, 0.93, 1.51]}
                    rotation={[-3.09, 0.23, -0.01]}
                    scale={-0.19}
                />
                <group
                    name="WGT-rig_foot_ikR"
                    position={[-0.28, 0.14, -0.08]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.25}
                />
                <group
                    name="WGT-rig_VIS_thigh_ik_poleR"
                    position={[-0.24, 1.01, 0.03]}
                    rotation={[-Math.PI / 2, 0, 0.28]}
                    scale={-1.52}
                />
                <group
                    name="WGT-rig_thigh_tweakR"
                    position={[-0.18, 1.66, 0.02]}
                    rotation={[1.57, -0.08, 0.23]}
                    scale={-0.16}
                />
                <group
                    name="WGT-rig_thigh_tweakR001"
                    position={[-0.21, 1.33, 0.03]}
                    rotation={[1.57, -0.08, 0.23]}
                    scale={-0.16}
                />
                <group
                    name="WGT-rig_shin_tweakR"
                    position={[-0.24, 1.01, 0.03]}
                    rotation={[1.69, -0.06, 0.23]}
                    scale={-0.22}
                />
                <group
                    name="WGT-rig_shin_tweakR001"
                    position={[-0.26, 0.57, -0.03]}
                    rotation={[1.69, -0.06, 0.23]}
                    scale={-0.22}
                />
                <group
                    name="WGT-rig_foot_tweakR"
                    position={[-0.28, 0.14, -0.08]}
                    rotation={[0.44, -0.24, 0.11]}
                    scale={-0.06}
                />
                <group
                    name="WGT-rig_foot_spin_ikR"
                    position={[-0.34, 0.04, 0.14]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.12}
                />
                <group
                    name="WGT-rig_foot_heel_ikR"
                    position={[-0.28, 0.14, -0.08]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.12}
                />
                <group
                    name="WGT-rig_toe_ikR"
                    position={[-0.34, 0.04, 0.14]}
                    rotation={[0, 0, 3.14]}
                    scale={-0.11}
                />
                <group name="WGT-rig_root" scale={1.47} />
            </group>
        </group>
    )
}
useGLTF.preload('/models/Avatar.glb')
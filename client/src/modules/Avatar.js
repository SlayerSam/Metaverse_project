import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

export function Avatar({ group }) {
    const { nodes, materials, animations } = useGLTF('/models/Avatar.glb')
    const { actions } = useAnimations(animations, group)
    const [keys, setKeys] = useState({})

    const speed = 0.1
    const rotationSpeed = 0.05;

    const handleKeyDown = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }))
    }

    const handleKeyUp = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }))
    }

    useFrame((state) => {
        let isMoving = false;
        const direction = new THREE.Vector3();
        const camera = state.camera;


        const head = group.current.getObjectByName('Head');
        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

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
            isMoving = true;
        }

        if (keys['ArrowRight'] || keys['KeyD']) {
            group.current.rotation.y -= rotationSpeed;
            isMoving = true;
        }

        if (isMoving) {
            actions['Walking']?.play();
            actions['Still']?.stop();
        } else {
            actions['Walking']?.stop();
            actions['Still']?.play();
        }
        actions['Still']?.play()
    });

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
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
                    position={[0, 1.784, -0.036]}
                    rotation={[1.823, 0, 0]}
                    scale={0.256}
                />
                <group
                    name="WGT-rig_spine_fk001"
                    position={[0, 2.013, -0.007]}
                    rotation={[1.694, 0, 0]}
                    scale={0.23}
                />
                <group
                    name="WGT-rig_spine_fk002"
                    position={[0, 2.013, -0.007]}
                    rotation={[1.539, 0, 0]}
                    scale={0.291}
                />
                <group
                    name="WGT-rig_spine_fk003"
                    position={[0, 2.304, -0.017]}
                    rotation={[1.542, 0, 0]}
                    scale={0.324}
                />
                <group
                    name="WGT-rig_tweak_spine"
                    position={[0, 1.536, -0.1]}
                    rotation={[1.823, 0, 0]}
                    scale={0.128}
                />
                <group
                    name="WGT-rig_tweak_spine001"
                    position={[0, 1.784, -0.036]}
                    rotation={[1.694, 0, 0]}
                    scale={0.115}
                />
                <group
                    name="WGT-rig_tweak_spine002"
                    position={[0, 2.013, -0.007]}
                    rotation={[1.539, 0, 0]}
                    scale={0.146}
                />
                <group
                    name="WGT-rig_tweak_spine003"
                    position={[0, 2.304, -0.017]}
                    rotation={[1.542, 0, 0]}
                    scale={0.162}
                />
                <group
                    name="WGT-rig_tweak_spine004"
                    position={[0, 2.628, -0.026]}
                    rotation={[1.948, 0, 0]}
                    scale={0.056}
                />
                <group name="WGT-rig_torso" position={[0, 1.66, -0.068]} scale={0.661} />
                <group
                    name="WGT-rig_hips"
                    position={[0, 1.536, -0.1]}
                    rotation={[1.823, 0, 0]}
                    scale={0.275}
                />
                <group
                    name="WGT-rig_chest"
                    position={[0, 2.304, -0.017]}
                    rotation={[1.542, 0, 0]}
                    scale={0.367}
                />
                <group
                    name="WGT-rig_shoulderL"
                    position={[0.031, 2.538, 0.109]}
                    rotation={[-0.001, -1.039, -0.001]}
                    scale={0.295}
                />
                <group
                    name="WGT-rig_upper_arm_parentL"
                    position={[0.35, 2.527, -0.069]}
                    rotation={[0.026, -1.543, -1.486]}
                    scale={0.119}
                />
                <group
                    name="WGT-rig_upper_arm_fkL"
                    position={[0.35, 2.527, -0.069]}
                    rotation={[0.026, -1.543, -1.486]}
                    scale={0.476}
                />
                <group
                    name="WGT-rig_forearm_fkL"
                    position={[0.825, 2.528, -0.082]}
                    rotation={[3.038, -1.518, 1.526]}
                    scale={0.423}
                />
                <group
                    name="WGT-rig_hand_fkL"
                    position={[1.248, 2.53, -0.06]}
                    rotation={[-2.881, -1.409, 1.887]}
                    scale={0.135}
                />
                <group
                    name="WGT-rig_upper_arm_ikL"
                    position={[0.35, 2.527, -0.069]}
                    rotation={[0.026, -1.543, -1.486]}
                    scale={0.476}
                />
                <group
                    name="WGT-rig_upper_arm_ik_targetL"
                    position={[0.835, 2.474, -0.978]}
                    rotation={[3.082, 0.01, -0.339]}
                    scale={0.112}
                />
                <group
                    name="WGT-rig_hand_ikL"
                    position={[1.248, 2.53, -0.06]}
                    rotation={[-2.881, -1.409, 1.887]}
                    scale={0.135}
                />
                <group
                    name="WGT-rig_VIS_upper_arm_ik_poleL"
                    position={[0.825, 2.528, -0.082]}
                    rotation={[Math.PI / 2, 0, -1.506]}
                    scale={0.898}
                />
                <group
                    name="WGT-rig_upper_arm_tweakL"
                    position={[0.35, 2.527, -0.069]}
                    rotation={[0.026, -1.543, -1.486]}
                    scale={0.119}
                />
                <group
                    name="WGT-rig_upper_arm_tweakL001"
                    position={[0.588, 2.527, -0.075]}
                    rotation={[0.026, -1.543, -1.486]}
                    scale={0.119}
                />
                <group
                    name="WGT-rig_forearm_tweakL"
                    position={[0.825, 2.528, -0.082]}
                    rotation={[3.038, -1.518, 1.526]}
                    scale={0.106}
                />
                <group
                    name="WGT-rig_forearm_tweakL001"
                    position={[1.037, 2.529, -0.071]}
                    rotation={[3.038, -1.518, 1.526]}
                    scale={0.106}
                />
                <group
                    name="WGT-rig_hand_tweakL"
                    position={[1.248, 2.53, -0.06]}
                    rotation={[-2.881, -1.409, 1.887]}
                    scale={0.034}
                />
                <group
                    name="WGT-rig_palmL"
                    position={[1.314, 2.528, -0.091]}
                    rotation={[0.911, -1.388, 0.774]}
                    scale={0.101}
                />
                <group
                    name="WGT-rig_f_index01L"
                    position={[1.42, 2.528, 0.022]}
                    rotation={[-2.255, -1.292, 0.449]}
                    scale={0.073}
                />
                <group
                    name="WGT-rig_f_index02L"
                    position={[1.489, 2.512, 0.035]}
                    rotation={[-1.791, -1.253, 0.889]}
                    scale={0.046}
                />
                <group
                    name="WGT-rig_f_index03L"
                    position={[1.533, 2.498, 0.038]}
                    rotation={[-1.847, -1.12, 0.837]}
                    scale={0.052}
                />
                <group
                    name="WGT-rig_f_index01L001"
                    position={[1.58, 2.476, 0.044]}
                    rotation={[1.294, 1.12, 1.337]}
                    scale={0.026}
                />
                <group
                    name="WGT-rig_f_index01_masterL"
                    position={[1.42, 2.528, 0.022]}
                    rotation={[-2.255, -1.292, 0.449]}
                    scale={0.285}
                />
                <group
                    name="WGT-rig_thumb01L"
                    position={[1.29, 2.504, -0.005]}
                    rotation={[-2.67, -0.616, -1.025]}
                    scale={0.054}
                />
                <group
                    name="WGT-rig_thumb02L"
                    position={[1.321, 2.484, 0.034]}
                    rotation={[-2.371, -0.857, -0.816]}
                    scale={0.058}
                />
                <group
                    name="WGT-rig_thumb03L"
                    position={[1.365, 2.457, 0.061]}
                    rotation={[-2.234, -1.019, -0.704]}
                    scale={0.066}
                />
                <group
                    name="WGT-rig_thumb01L001"
                    position={[1.422, 2.43, 0.082]}
                    rotation={[0.908, 1.019, 0.469]}
                    scale={0.033}
                />
                <group
                    name="WGT-rig_thumb01_masterL"
                    position={[1.29, 2.504, -0.005]}
                    rotation={[-2.67, -0.616, -1.025]}
                    scale={0.272}
                />
                <group
                    name="WGT-rig_f_middle01L"
                    position={[1.435, 2.537, -0.024]}
                    rotation={[-1.958, -1.318, -3.078]}
                    scale={0.073}
                />
                <group
                    name="WGT-rig_f_middle02L"
                    position={[1.506, 2.52, -0.017]}
                    rotation={[-1.882, -1.332, -3.005]}
                    scale={0.046}
                />
                <group
                    name="WGT-rig_f_middle03L"
                    position={[1.55, 2.51, -0.014]}
                    rotation={[-2.248, -1.295, 2.924]}
                    scale={0.046}
                />
                <group
                    name="WGT-rig_f_middle01L001"
                    position={[1.594, 2.5, -0.006]}
                    rotation={[0.893, 1.295, -2.042]}
                    scale={0.023}
                />
                <group
                    name="WGT-rig_f_middle01_masterL"
                    position={[1.435, 2.537, -0.024]}
                    rotation={[-1.958, -1.318, -3.078]}
                    scale={0.278}
                />
                <group
                    name="WGT-rig_f_ring01L"
                    position={[1.443, 2.533, -0.063]}
                    rotation={[-1.299, -1.343, 2.275]}
                    scale={0.049}
                />
                <group
                    name="WGT-rig_f_ring02L"
                    position={[1.49, 2.522, -0.066]}
                    rotation={[-1.524, -1.317, 2.057]}
                    scale={0.046}
                />
                <group
                    name="WGT-rig_f_ring03L"
                    position={[1.535, 2.511, -0.067]}
                    rotation={[-1.506, -1.2, 2.075]}
                    scale={0.044}
                />
                <group
                    name="WGT-rig_f_ring01L001"
                    position={[1.576, 2.495, -0.068]}
                    rotation={[1.636, 1.2, 1.954]}
                    scale={0.022}
                />
                <group
                    name="WGT-rig_f_ring01_masterL"
                    position={[1.443, 2.533, -0.063]}
                    rotation={[-1.299, -1.343, 2.275]}
                    scale={0.222}
                />
                <group
                    name="WGT-rig_f_pinky01L"
                    position={[1.419, 2.542, -0.102]}
                    rotation={[-1.276, -1.341, 1.856]}
                    scale={0.047}
                />
                <group
                    name="WGT-rig_f_pinky02L"
                    position={[1.465, 2.532, -0.105]}
                    rotation={[-1.401, -1.254, 1.736]}
                    scale={0.038}
                />
                <group
                    name="WGT-rig_f_pinky03L"
                    position={[1.501, 2.521, -0.107]}
                    rotation={[-1.426, -1.004, 1.713]}
                    scale={0.036}
                />
                <group
                    name="WGT-rig_f_pinky01L001"
                    position={[1.532, 2.501, -0.11]}
                    rotation={[1.716, 1.004, 1.468]}
                    scale={0.018}
                />
                <group
                    name="WGT-rig_f_pinky01_masterL"
                    position={[1.419, 2.542, -0.102]}
                    rotation={[-1.276, -1.341, 1.856]}
                    scale={0.197}
                />
                <group
                    name="WGT-rig_shoulderR"
                    position={[-0.031, 2.538, 0.109]}
                    rotation={[3.14, -1.039, -0.001]}
                    scale={-0.295}
                />
                <group
                    name="WGT-rig_upper_arm_parentR"
                    position={[-0.35, 2.527, -0.069]}
                    rotation={[-3.116, -1.543, -1.486]}
                    scale={-0.119}
                />
                <group
                    name="WGT-rig_upper_arm_fkR"
                    position={[-0.35, 2.527, -0.069]}
                    rotation={[-3.116, -1.543, -1.486]}
                    scale={-0.476}
                />
                <group
                    name="WGT-rig_forearm_fkR"
                    position={[-0.825, 2.528, -0.082]}
                    rotation={[-0.104, -1.518, 1.526]}
                    scale={-0.423}
                />
                <group
                    name="WGT-rig_hand_fkR"
                    position={[-1.248, 2.53, -0.06]}
                    rotation={[0.261, -1.409, 1.887]}
                    scale={-0.135}
                />
                <group
                    name="WGT-rig_upper_arm_ikR"
                    position={[-0.35, 2.527, -0.069]}
                    rotation={[-3.116, -1.543, -1.486]}
                    scale={-0.476}
                />
                <group
                    name="WGT-rig_upper_arm_ik_targetR"
                    position={[-0.835, 2.474, -0.978]}
                    rotation={[-0.059, 0.01, -0.339]}
                    scale={-0.112}
                />
                <group
                    name="WGT-rig_hand_ikR"
                    position={[-1.248, 2.53, -0.06]}
                    rotation={[0.261, -1.409, 1.887]}
                    scale={-0.135}
                />
                <group
                    name="WGT-rig_VIS_upper_arm_ik_poleR"
                    position={[-0.825, 2.528, -0.082]}
                    rotation={[-Math.PI / 2, 0, -1.506]}
                    scale={-0.898}
                />
                <group
                    name="WGT-rig_upper_arm_tweakR"
                    position={[-0.35, 2.527, -0.069]}
                    rotation={[-3.116, -1.543, -1.486]}
                    scale={-0.119}
                />
                <group
                    name="WGT-rig_upper_arm_tweakR001"
                    position={[-0.588, 2.527, -0.075]}
                    rotation={[-3.116, -1.543, -1.486]}
                    scale={-0.119}
                />
                <group
                    name="WGT-rig_forearm_tweakR"
                    position={[-0.825, 2.528, -0.082]}
                    rotation={[-0.104, -1.518, 1.526]}
                    scale={-0.106}
                />
                <group
                    name="WGT-rig_forearm_tweakR001"
                    position={[-1.037, 2.529, -0.071]}
                    rotation={[-0.104, -1.518, 1.526]}
                    scale={-0.106}
                />
                <group
                    name="WGT-rig_hand_tweakR"
                    position={[-1.248, 2.53, -0.06]}
                    rotation={[0.261, -1.409, 1.887]}
                    scale={-0.034}
                />
                <group
                    name="WGT-rig_palmR"
                    position={[-1.314, 2.528, -0.091]}
                    rotation={[-2.231, -1.388, 0.774]}
                    scale={-0.101}
                />
                <group
                    name="WGT-rig_f_index01R"
                    position={[-1.42, 2.528, 0.022]}
                    rotation={[0.887, -1.292, 0.449]}
                    scale={-0.073}
                />
                <group
                    name="WGT-rig_f_index02R"
                    position={[-1.489, 2.512, 0.035]}
                    rotation={[1.351, -1.253, 0.889]}
                    scale={-0.046}
                />
                <group
                    name="WGT-rig_f_index03R"
                    position={[-1.533, 2.498, 0.038]}
                    rotation={[1.294, -1.12, 0.837]}
                    scale={-0.052}
                />
                <group
                    name="WGT-rig_f_index01R001"
                    position={[-1.58, 2.476, 0.044]}
                    rotation={[-1.847, 1.12, 1.337]}
                    scale={-0.026}
                />
                <group
                    name="WGT-rig_f_index01_masterR"
                    position={[-1.42, 2.528, 0.022]}
                    rotation={[0.887, -1.292, 0.449]}
                    scale={-0.285}
                />
                <group
                    name="WGT-rig_thumb01R"
                    position={[-1.29, 2.504, -0.005]}
                    rotation={[0.471, -0.616, -1.025]}
                    scale={-0.054}
                />
                <group
                    name="WGT-rig_thumb02R"
                    position={[-1.321, 2.484, 0.034]}
                    rotation={[0.771, -0.857, -0.816]}
                    scale={-0.058}
                />
                <group
                    name="WGT-rig_thumb03R"
                    position={[-1.365, 2.457, 0.061]}
                    rotation={[0.908, -1.019, -0.704]}
                    scale={-0.066}
                />
                <group
                    name="WGT-rig_thumb01R001"
                    position={[-1.422, 2.43, 0.082]}
                    rotation={[-2.234, 1.019, 0.469]}
                    scale={-0.033}
                />
                <group
                    name="WGT-rig_thumb01_masterR"
                    position={[-1.29, 2.504, -0.005]}
                    rotation={[0.471, -0.616, -1.025]}
                    scale={-0.272}
                />
                <group
                    name="WGT-rig_f_middle01R"
                    position={[-1.435, 2.537, -0.024]}
                    rotation={[1.184, -1.318, -3.078]}
                    scale={-0.073}
                />
                <group
                    name="WGT-rig_f_middle02R"
                    position={[-1.506, 2.52, -0.017]}
                    rotation={[1.26, -1.332, -3.005]}
                    scale={-0.046}
                />
                <group
                    name="WGT-rig_f_middle03R"
                    position={[-1.55, 2.51, -0.014]}
                    rotation={[0.893, -1.295, 2.924]}
                    scale={-0.046}
                />
                <group
                    name="WGT-rig_f_middle01R001"
                    position={[-1.594, 2.5, -0.006]}
                    rotation={[-2.248, 1.295, -2.042]}
                    scale={-0.023}
                />
                <group
                    name="WGT-rig_f_middle01_masterR"
                    position={[-1.435, 2.537, -0.024]}
                    rotation={[1.184, -1.318, -3.078]}
                    scale={-0.278}
                />
                <group
                    name="WGT-rig_f_ring01R"
                    position={[-1.443, 2.533, -0.063]}
                    rotation={[1.843, -1.343, 2.275]}
                    scale={-0.049}
                />
                <group
                    name="WGT-rig_f_ring02R"
                    position={[-1.49, 2.522, -0.066]}
                    rotation={[1.617, -1.317, 2.057]}
                    scale={-0.046}
                />
                <group
                    name="WGT-rig_f_ring03R"
                    position={[-1.535, 2.511, -0.067]}
                    rotation={[1.636, -1.2, 2.075]}
                    scale={-0.044}
                />
                <group
                    name="WGT-rig_f_ring01R001"
                    position={[-1.576, 2.495, -0.068]}
                    rotation={[-1.506, 1.2, 1.954]}
                    scale={-0.022}
                />
                <group
                    name="WGT-rig_f_ring01_masterR"
                    position={[-1.443, 2.533, -0.063]}
                    rotation={[1.843, -1.343, 2.275]}
                    scale={-0.222}
                />
                <group
                    name="WGT-rig_f_pinky01R"
                    position={[-1.419, 2.542, -0.102]}
                    rotation={[1.866, -1.341, 1.856]}
                    scale={-0.047}
                />
                <group
                    name="WGT-rig_f_pinky02R"
                    position={[-1.465, 2.532, -0.105]}
                    rotation={[1.74, -1.254, 1.736]}
                    scale={-0.038}
                />
                <group
                    name="WGT-rig_f_pinky03R"
                    position={[-1.501, 2.521, -0.107]}
                    rotation={[1.716, -1.004, 1.713]}
                    scale={-0.036}
                />
                <group
                    name="WGT-rig_f_pinky01R001"
                    position={[-1.532, 2.501, -0.11]}
                    rotation={[-1.426, 1.004, 1.468]}
                    scale={-0.018}
                />
                <group
                    name="WGT-rig_f_pinky01_masterR"
                    position={[-1.419, 2.542, -0.102]}
                    rotation={[1.866, -1.341, 1.856]}
                    scale={-0.197}
                />
                <group
                    name="WGT-rig_neck"
                    position={[0, 2.628, -0.026]}
                    rotation={[1.856, 0, 0]}
                    scale={0.216}
                />
                <group
                    name="WGT-rig_head"
                    position={[0, 2.835, 0.035]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.334}
                />
                <group
                    name="WGT-rig_tweak_spine005"
                    position={[0, 2.731, 0.015]}
                    rotation={[1.758, 0, 0]}
                    scale={0.053}
                />
                <group
                    name="WGT-rig_thigh_parentL"
                    position={[0.182, 1.66, 0.025]}
                    rotation={[-1.572, -0.083, 0.272]}
                    scale={0.164}
                />
                <group
                    name="WGT-rig_thigh_fkL"
                    position={[0.182, 1.66, 0.025]}
                    rotation={[-1.572, -0.083, 0.272]}
                    scale={0.655}
                />
                <group
                    name="WGT-rig_shin_fkL"
                    position={[0.237, 1.007, 0.026]}
                    rotation={[-1.453, -0.049, 0.28]}
                    scale={0.871}
                />
                <group
                    name="WGT-rig_foot_fkL"
                    position={[0.28, 0.143, -0.076]}
                    rotation={[-2.698, -0.262, 0.122]}
                    scale={0.249}
                />
                <group
                    name="WGT-rig_toe_fkL"
                    position={[0.344, 0.04, 0.141]}
                    rotation={[-Math.PI, 0, -3.141]}
                    scale={0.113}
                />
                <group
                    name="WGT-rig_thigh_ikL"
                    position={[0.182, 1.66, 0.025]}
                    rotation={[-1.572, -0.083, 0.272]}
                    scale={0.655}
                />
                <group
                    name="WGT-rig_thigh_ik_targetL"
                    position={[0.652, 0.936, 1.49]}
                    rotation={[0.048, 0.277, -0.007]}
                    scale={0.19}
                />
                <group name="WGT-rig_foot_ikL" position={[0.28, 0.143, -0.076]} scale={0.249} />
                <group
                    name="WGT-rig_VIS_thigh_ik_poleL"
                    position={[0.237, 1.007, 0.026]}
                    rotation={[Math.PI / 2, 0, 0.324]}
                    scale={1.524}
                />
                <group
                    name="WGT-rig_thigh_tweakL"
                    position={[0.182, 1.66, 0.025]}
                    rotation={[-1.572, -0.083, 0.272]}
                    scale={0.164}
                />
                <group
                    name="WGT-rig_thigh_tweakL001"
                    position={[0.209, 1.333, 0.025]}
                    rotation={[-1.572, -0.083, 0.272]}
                    scale={0.164}
                />
                <group
                    name="WGT-rig_shin_tweakL"
                    position={[0.237, 1.007, 0.026]}
                    rotation={[-1.453, -0.049, 0.28]}
                    scale={0.218}
                />
                <group
                    name="WGT-rig_shin_tweakL001"
                    position={[0.258, 0.575, -0.025]}
                    rotation={[-1.453, -0.049, 0.28]}
                    scale={0.218}
                />
                <group
                    name="WGT-rig_foot_tweakL"
                    position={[0.28, 0.143, -0.076]}
                    rotation={[-2.698, -0.262, 0.122]}
                    scale={0.062}
                />
                <group name="WGT-rig_foot_spin_ikL" position={[0.344, 0.04, 0.141]} scale={0.124} />
                <group name="WGT-rig_foot_heel_ikL" position={[0.28, 0.143, -0.076]} scale={0.124} />
                <group
                    name="WGT-rig_toe_ikL"
                    position={[0.344, 0.04, 0.141]}
                    rotation={[-Math.PI, 0, -3.141]}
                    scale={0.113}
                />
                <group
                    name="WGT-rig_thigh_parentR"
                    position={[-0.182, 1.66, 0.025]}
                    rotation={[1.57, -0.083, 0.227]}
                    scale={-0.164}
                />
                <group
                    name="WGT-rig_thigh_fkR"
                    position={[-0.182, 1.66, 0.025]}
                    rotation={[1.57, -0.083, 0.227]}
                    scale={-0.655}
                />
                <group
                    name="WGT-rig_shin_fkR"
                    position={[-0.237, 1.007, 0.026]}
                    rotation={[1.688, -0.055, 0.235]}
                    scale={-0.871}
                />
                <group
                    name="WGT-rig_foot_fkR"
                    position={[-0.285, 0.143, -0.076]}
                    rotation={[0.443, -0.242, 0.113]}
                    scale={-0.247}
                />
                <group
                    name="WGT-rig_toe_fkR"
                    position={[-0.344, 0.04, 0.141]}
                    rotation={[0, 0, 3.141]}
                    scale={-0.113}
                />
                <group
                    name="WGT-rig_thigh_ikR"
                    position={[-0.182, 1.66, 0.025]}
                    rotation={[1.57, -0.083, 0.227]}
                    scale={-0.655}
                />
                <group
                    name="WGT-rig_thigh_ik_targetR"
                    position={[-0.586, 0.932, 1.507]}
                    rotation={[-3.091, 0.231, -0.006]}
                    scale={-0.19}
                />
                <group
                    name="WGT-rig_foot_ikR"
                    position={[-0.285, 0.143, -0.076]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.247}
                />
                <group
                    name="WGT-rig_VIS_thigh_ik_poleR"
                    position={[-0.237, 1.007, 0.026]}
                    rotation={[-Math.PI / 2, 0, 0.284]}
                    scale={-1.524}
                />
                <group
                    name="WGT-rig_thigh_tweakR"
                    position={[-0.182, 1.66, 0.025]}
                    rotation={[1.57, -0.083, 0.227]}
                    scale={-0.164}
                />
                <group
                    name="WGT-rig_thigh_tweakR001"
                    position={[-0.209, 1.333, 0.025]}
                    rotation={[1.57, -0.083, 0.227]}
                    scale={-0.164}
                />
                <group
                    name="WGT-rig_shin_tweakR"
                    position={[-0.237, 1.007, 0.026]}
                    rotation={[1.688, -0.055, 0.235]}
                    scale={-0.218}
                />
                <group
                    name="WGT-rig_shin_tweakR001"
                    position={[-0.261, 0.575, -0.025]}
                    rotation={[1.688, -0.055, 0.235]}
                    scale={-0.218}
                />
                <group
                    name="WGT-rig_foot_tweakR"
                    position={[-0.285, 0.143, -0.076]}
                    rotation={[0.443, -0.242, 0.113]}
                    scale={-0.062}
                />
                <group
                    name="WGT-rig_foot_spin_ikR"
                    position={[-0.344, 0.04, 0.141]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.124}
                />
                <group
                    name="WGT-rig_foot_heel_ikR"
                    position={[-0.285, 0.143, -0.076]}
                    rotation={[-Math.PI, 0, 0]}
                    scale={-0.124}
                />
                <group
                    name="WGT-rig_toe_ikR"
                    position={[-0.344, 0.04, 0.141]}
                    rotation={[0, 0, 3.141]}
                    scale={-0.113}
                />
                <group name="WGT-rig_root" scale={1.469} />
            </group>


        </group>
    )
}
useGLTF.preload('/models/Avatar.glb')
'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';
import { useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';

function useShirtModel(url) {
    if (url) {
        const gltf = useGLTF(url);
        return gltf;
    }
}

export function MaleModel({
    group,
    nodes,
    materials,
    hairColor = '#000000',
    shirtColor = '#ff0000',
    pantColor = '#0000ff',
    shoesColor = '#ffffff',
    position,
    rotation,
    armWidth,
    armLength,
    legWidth,
    legLength,
    display = false,
    ...props
}) {
    const { shirtModelUrl: modelPath } = useSelector((state) => state.avatar.maleAvatar)
    useEffect(() => {
        useGLTF.preload(modelPath);
    }, [modelPath]);
    const shirtModel = useShirtModel(modelPath);

    const shirtMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(shirtColor);
        return newMaterial;
    }, [shirtColor, materials.Ch42_Body]);

    const hairMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Hair.clone();
        newMaterial.color = new THREE.Color(hairColor);
        newMaterial.emissive = new THREE.Color(hairColor);  // Correctly set the emissive color
        newMaterial.emissiveIntensity = 0.5;  // Optional: control the intensity of emissive color
        return newMaterial;
    }, [hairColor, materials.Ch42_Hair]);

    const pantMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(pantColor);
        return newMaterial;
    }, [pantColor, materials.Ch42_Shorts]);

    const shoesMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(shoesColor);
        return newMaterial;
    }, [shoesColor, materials.Ch42_Sneakers]);

    const shirtRef = useRef();

    useEffect(() => {
        if (modelPath == '') {
            nodes.mixamorigSpine.add(nodes.Ch42_Shirt);
            nodes.Ch42_Shirt.visible = true;
        }
        if (!shirtModel?.scene || !nodes?.mixamorigSpine) return;

        const shirtClone = shirtModel.scene.clone(true);
        let shirtMesh;

        shirtClone.traverse((child) => {
            if (child.isSkinnedMesh) {
                shirtMesh = child.clone();
                child.skeleton = nodes.Ch42_Body1.skeleton;
                child.bind(nodes.Ch42_Body1.skeleton)
            }
        });

        if (!shirtMesh) return;

        if (nodes.Ch42_Shirt) {
            nodes.Ch42_Shirt.visible = false;
        }
        shirtMesh.bind(nodes.Ch42_Body1.skeleton);

        if (nodes && nodes.mixamorigSpine && nodes.Ch42_Shirt) {
            group.current?.getObjectByName("Ch42_Shirt")?.removeFromParent();
        }
        shirtRef.current = shirtMesh;
        nodes.mixamorigSpine.add(shirtMesh);

        return () => {
            nodes.mixamorigSpine.remove(shirtMesh);
        };

    }, [shirtModel, nodes, shirtMaterial]);

    useFrame(() => {
        if (nodes && armWidth && armLength) {
            if (nodes['mixamorigLeftArm']) {
                nodes['mixamorigLeftArm'].scale.set(armWidth, armLength, armWidth);
                nodes['mixamorigRightArm'].scale.set(armWidth, armLength, armWidth);
            }
        }
        if (nodes && legWidth && legLength && position) {
            if (nodes['mixamorigLeftLeg']) {
                const legOffset = (legLength - 1) * 4;
                nodes['mixamorigLeftLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigLeftUpLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigRightLeg'].scale.set(legWidth, legLength, legWidth);
                nodes['mixamorigRightUpLeg'].scale.set(legWidth, legLength, legWidth);
                if (display) {
                    group.current.position.y = legOffset - 2.8
                }
                else {
                    group.current.position.y = 0
                }
            }
        }
    }, [nodes, armWidth, armLength, legWidth, legLength]);

    return (
        <group ref={group} {...props} position={position} rotation={rotation && [0, rotation, 0]} dispose={null}>
            <group name="Scene">
                <group name="idle" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <skinnedMesh
                        name="Ch42__Eyelashes"
                        geometry={nodes.Ch42__Eyelashes.geometry}
                        material={materials.Ch42_Hair}
                        skeleton={nodes.Ch42__Eyelashes.skeleton}
                    />

                    <skinnedMesh
                        name="Ch42_Body1"
                        geometry={nodes.Ch42_Body1.geometry}
                        material={materials.Ch42_Body}
                        skeleton={nodes.Ch42_Body1.skeleton}
                    />

                    {/* Hair with emissive color */}
                    <skinnedMesh
                        name="Ch42_Hair1"
                        geometry={nodes.Ch42_Hair1.geometry}
                        material={hairMaterial}  // Apply updated hair material with emissive color
                        skeleton={nodes.Ch42_Hair1.skeleton}
                        material-color={hairColor}
                    />

                    <skinnedMesh
                        name="Ch42_Shirt"
                        geometry={nodes.Ch42_Shirt.geometry}
                        material={shirtMaterial}
                        skeleton={nodes.Ch42_Shirt.skeleton}
                    />

                    <skinnedMesh
                        name="Ch42_Shorts"
                        geometry={nodes.Ch42_Shorts.geometry}
                        material={pantMaterial}
                        skeleton={nodes.Ch42_Shorts.skeleton}
                        material-color={pantColor}
                    />

                    {/* Shoes */}
                    <skinnedMesh
                        name="Ch42_Sneakers"
                        geometry={nodes.Ch42_Sneakers.geometry}
                        material={shoesMaterial}
                        skeleton={nodes.Ch42_Sneakers.skeleton}
                        material-color={shoesColor}
                    />
                    <primitive object={nodes.mixamorigHips} />
                </group>
            </group>
        </group>
    )
}

export function FemaleModel({
    group,
    nodes,
    materials,
    hairColor = '#000000',
    shirtColor = '#ff0000',
    pantColor = '#0000ff',
    shoesColor = '#ffffff',
    position,
    rotation,
    armWidth,
    armLength,
    legWidth,
    legLength,
    display = false,
    ...props
}) {
    const shirtMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(shirtColor);
        return newMaterial;
    }, [shirtColor, materials.Ch42_Body]);

    const hairMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Hair.clone();
        newMaterial.color = new THREE.Color(hairColor);
        newMaterial.emissive = new THREE.Color(hairColor);  // Correctly set the emissive color
        newMaterial.emissiveIntensity = 0.5;  // Optional: control the intensity of emissive color
        return newMaterial;
    }, [hairColor, materials.Ch42_Hair]);

    const pantMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(pantColor);
        return newMaterial;
    }, [pantColor, materials.Ch42_Shorts]);

    const shoesMaterial = useMemo(() => {
        const newMaterial = materials.Ch42_Body.clone();
        newMaterial.color = new THREE.Color(shoesColor);
        return newMaterial;
    }, [shoesColor, materials.Ch42_Sneakers]);

    useFrame(() => {
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
                if (display) {
                    group.current.position.y = legOffset - 2.8
                } else {
                    group.current.position.y = legOffset - 0.28
                }
            }
        }
    }, [nodes, armWidth, armLength, legWidth, legLength]);

    return (
        <group ref={group} {...props} position={position} rotation={rotation && [0, rotation, 0]} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <primitive object={nodes.mixamorig2Hips} />
                </group>
                <skinnedMesh
                    name="Ch42__Eyelashes"
                    geometry={nodes.Ch42__Eyelashes.geometry}
                    material={materials.Ch42_Hair}
                    skeleton={nodes.Ch42__Eyelashes.skeleton}
                />

                <skinnedMesh
                    name="Ch42_Body1"
                    geometry={nodes.Ch42_Body1.geometry}
                    material={materials.Ch42_Body}
                    skeleton={nodes.Ch42_Body1.skeleton}
                />

                {/* Hair with emissive color */}
                <skinnedMesh
                    name="Ch42_Hair1"
                    geometry={nodes.Ch42_Hair1.geometry}
                    material={hairMaterial}  // Apply updated hair material with emissive color
                    skeleton={nodes.Ch42_Hair1.skeleton}
                    material-color={hairColor}
                />

                {/* Shirt */}
                <skinnedMesh
                    name="Ch42_Shirt"
                    geometry={nodes.Ch42_Shirt.geometry}
                    material={shirtMaterial}  // Apply the new shirt material
                    skeleton={nodes.Ch42_Shirt.skeleton}
                    material-color={shirtColor}
                />
                <skinnedMesh
                    name="Ch42_Shorts"
                    geometry={nodes.Ch42_Pants.geometry}
                    material={pantMaterial}
                    skeleton={nodes.Ch42_Pants.skeleton}
                    material-color={pantColor}
                />
                {/* Shoes */}
                <skinnedMesh
                    name="Ch42_Sneakers"
                    geometry={nodes.Ch42_Sneakers.geometry}
                    material={shoesMaterial}
                    skeleton={nodes.Ch42_Sneakers.skeleton}
                    material-color={shoesColor}
                />
            </group>
        </group >
    );
}

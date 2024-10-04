import React, { useMemo } from 'react';
import * as THREE from 'three';

export function AvatarModel({
    group,
    nodes,
    materials,
    hairColor = '#000000',
    shirtColor = '#ff0000',
    pantColor = '#0000ff',
    shoesColor = '#ffffff',
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

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="idle" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                    <skinnedMesh
                        name="Ch42__Eyelashes"
                        geometry={nodes.Ch42__Eyelashes.geometry}
                        material={materials.Ch42_Hair}
                        skeleton={nodes.Ch42__Eyelashes.skeleton}
                    />

                    {/* Apply body scaling to body part only */}
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

                    {/* Pants */}
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
    );
}

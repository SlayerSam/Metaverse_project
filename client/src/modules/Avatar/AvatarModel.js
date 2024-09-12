import React, { useEffect } from 'react';
import * as THREE from 'three'

export function AvatarModel({ group, nodes, materials, color, armLengthScale = 1, armWidthScale = 1, ...props }) {

    useEffect(() => {
        // Update the rotation of the node
        nodes['mixamorig1Neck'].rotation.set(0.4, 0, 0);
    }, [nodes]);
    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.016}>
                    <primitive object={nodes.mixamorig1Hips} />
                </group>
                <skinnedMesh
                    name="Ch36"
                    castShadow
                    receiveShadow
                    geometry={nodes.Ch36.geometry}
                    material={materials.Ch36_Body}
                    skeleton={nodes.Ch36.skeleton}
                    material-color={color}
                />
                <skinnedMesh
                    name="left_arm"
                    geometry={nodes.left_arm.geometry}
                    material={materials.Ch36_Body}
                    skeleton={nodes.left_arm.skeleton}
                    rotation={[Math.PI / 5, 0, 0]}
                    scale={0.016}
                />
                <skinnedMesh
                    name="right_arm"
                    geometry={nodes.right_arm.geometry}
                    material={materials.Ch36_Body}
                    skeleton={nodes.right_arm.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.016}
                />
            </group>
        </group>
    );
}
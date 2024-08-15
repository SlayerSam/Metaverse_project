import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function SampleBase(props) {
    const { nodes, materials } = useGLTF('/models/base.glb')
    return (
        <group {...props} dispose={null}>
            <group name="Scene">
                <mesh
                    name="Plane"
                    castShadow
                    receiveShadow
                    geometry={nodes.Plane.geometry}
                    material={materials['Material.001']}
                    scale={83.28249359}
                />
                <mesh
                    name="Cube"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube.geometry}
                    material={materials['Material.002']}
                    position={[0, 19.92068863, 70.2928009]}
                    rotation={[0, 0, -Math.PI]}
                    scale={[-19.6039257, -19.6039257, -5.9377923]}
                />
                <mesh
                    name="Cube001"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube001.geometry}
                    material={materials['Material.003']}
                    position={[-61.9070015, 19.77243614, -1.57805347]}
                    rotation={[Math.PI, -1.56254839, 0]}
                    scale={[-19.6039257, -19.6039257, -5.93779182]}
                />
                <mesh
                    name="Cube002"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube002.geometry}
                    material={materials['Material.005']}
                    position={[68.81295776, 19.69831085, -1.85144997]}
                    rotation={[0, -1.56556568, -Math.PI]}
                    scale={[-19.6039257, -19.6039257, -5.9377923]}
                />
                <mesh
                    name="Cube003"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube003.geometry}
                    material={materials['Material.004']}
                    position={[0, 19.69831085, -73.08344269]}
                    rotation={[0, 0, -Math.PI]}
                    scale={[-19.6039257, -19.6039257, -5.9377923]}
                />
                <mesh
                    name="Cube004"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube004.geometry}
                    material={materials['Material.006']}
                    position={[-45.93331146, 7, 0]}
                    scale={[0.30000001, 7, 4]}
                />
                <mesh
                    name="Cube005"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube005.geometry}
                    material={materials.Material}
                    position={[-46.03155136, 7, 0]}
                    scale={[0.13840006, 6, 3]}
                />
                <group
                    name="Plane001"
                    position={[-45.72563171, 7.19116497, 0]}
                    rotation={[-Math.PI, 0, Math.PI / 2]}
                    scale={[-6.41134691, -5.34950924, -3.268507]}
                />
                <mesh
                    name="Cube006"
                    castShadow
                    receiveShadow
                    geometry={nodes.Cube006.geometry}
                    material={nodes.Cube006.material}
                    position={[-37.62896347, 5.49143314, -0.30756855]}
                />
            </group>
        </group>
    )
}

useGLTF.preload('/models/base.glb')
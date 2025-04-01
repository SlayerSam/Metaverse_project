// import React from 'react'
// import { useGLTF, Reflector } from '@react-three/drei'

// export default function SampleBase(props) {
//     const { nodes, materials } = useGLTF('/models/base.glb')

//     return (
//         <group {...props} dispose={null}>
//             <group name="Scene">
//                 <mesh
//                     name="Plane"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Plane.geometry}
//                     material={materials['Material.001']}
//                     scale={83.282}
//                 />
//                 <mesh
//                     name="Cube"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube.geometry}
//                     material={materials['Material.002']}
//                     position={[0, 19.921, 70.293]}
//                     rotation={[0, 0, -Math.PI]}
//                     scale={[-19.604, -19.604, -5.938]}
//                 />
//                 <mesh
//                     name="Cube001"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube001.geometry}
//                     material={materials['Material.003']}
//                     position={[-61.907, 19.772, -1.578]}
//                     rotation={[Math.PI, -1.563, 0]}
//                     scale={[-19.604, -19.604, -5.938]}
//                 />
//                 <mesh
//                     name="Cube002"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube002.geometry}
//                     material={materials['Material.005']}
//                     position={[68.813, 19.698, -1.851]}
//                     rotation={[0, -1.566, -Math.PI]}
//                     scale={[-19.604, -19.604, -5.938]}
//                 />
//                 <mesh
//                     name="Cube003"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube003.geometry}
//                     material={materials['Material.004']}
//                     position={[0, 19.698, -73.083]}
//                     rotation={[0, 0, -Math.PI]}
//                     scale={[-19.604, -19.604, -5.938]}
//                 />
//                 <mesh
//                     name="Cube004"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube004.geometry}
//                     material={materials['Material.006']}
//                     position={[-45.933, 7, 0]}
//                     scale={[0.3, 7, 4]}
//                 />
//                 <mesh
//                     name="Cube005"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube005.geometry}
//                     material={materials.Material}
//                     position={[-46.032, 7, 0]}
//                     scale={[0.138, 6, 3]}
//                 />

//                 <Reflector
//                     resolution={1024}
//                     args={[1, 1]}
//                     mirror={0.8}
//                     scale={[8, 10, 3]}
//                 >
//                     {(Material, props) => (
//                         <Material
//                             metalness={1}
//                             roughness={0}
//                             {...props}
//                             color="#f0f0f0" // Light gray might work better than pure white
//                         />
//                     )}
//                 </Reflector>


//                 <mesh
//                     name="Cube006"
//                     castShadow
//                     receiveShadow
//                     geometry={nodes.Cube006.geometry}
//                     material={nodes.Cube006.material}
//                     position={[-37.629, 5.491, -0.308]}
//                 />
//             </group>
//         </group>
//     )
// }

// useGLTF.preload('/models/base.glb')

'use client';
import { useGLTF, Plane, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useState } from 'react'; // Add this import

export default function SampleBase() {
  // State for texture loading error
  const [textureError, setTextureError] = useState(false);
  
  // Load floor texture with error handling
  const floorTexture = useTexture(
    '/textures/mall-floor.jpg',
    (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(10, 10);
    },
    (error) => {
      console.error('Texture loading failed:', error);
      setTextureError(true);
    }
  );

  // Load models
  const { scene: model1 } = useGLTF('/models/11.glb');
  const { scene: model2 } = useGLTF('/models/12.glb');
  const { scene: model3 } = useGLTF('/models/13.glb');
  const { scene: model4 } = useGLTF('/models/14.glb');

  return (
    <group>
      {/* Floor */}
      <Plane 
        args={[100, 100]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          map={!textureError ? floorTexture : null}
          color={textureError ? "#f0f0f0" : undefined}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </Plane>

      {/* Rest of your component... */}
      <primitive object={model1} position={[-6.4, 0, 0]} />
      <primitive object={model2} position={[0, 0, 0]} />
      <primitive object={model3} position={[6.5, 0, 0]} />
      <primitive object={model4} position={[10, 0, 12]} />

      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />
      <Environment preset="city" background />
    </group>
  );
}

// Preload models
useGLTF.preload('/models/11.glb');
useGLTF.preload('/models/12.glb');
useGLTF.preload('/models/13.glb');
useGLTF.preload('/models/14.glb');
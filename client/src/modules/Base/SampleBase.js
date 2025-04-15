'use client';
import { useGLTF, Plane, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';

export default function SampleBase() {
  const [textureError, setTextureError] = useState(false);

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
  const { scene: model5 } = useGLTF('/models/table601.glb');
  const { scene: model6 } = useGLTF('/models/food24.glb');
  const { scene: model7 } = useGLTF('/models/grass401.glb');

  // Refs for obstacles
  const refs = Array.from({ length: 7 }, () => useRef());

  // Register bounding boxes after mount
  useEffect(() => {
    refs.forEach((ref) => {
      if (ref.current && typeof window.registerObstacle === 'function') {
        const box = new THREE.Box3().setFromObject(ref.current);
        if (box) window.registerObstacle(box);
      }
    });
  }, []);

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

      {/* Models with refs for obstacle registration */}
      <group ref={refs[0]}><primitive object={model1} position={[-6.4, 0, 0]} /></group>
      <group ref={refs[1]}><primitive object={model2} position={[0, 0, 0]} /></group>
      <group ref={refs[2]}><primitive object={model3} position={[6.5, 0, 0]} /></group>
      <group ref={refs[3]}><primitive object={model4} position={[10, 0, 12]} /></group>
      <group ref={refs[4]}><primitive object={model5} position={[-10, 0, 12]} /></group>
      <group ref={refs[5]}><primitive object={model6} position={[-12, 0, 0]} /></group>
      <group ref={refs[6]}><primitive object={model7} position={[-12, 0, 12]} /></group>

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
useGLTF.preload('/models/table601.glb');
useGLTF.preload('/models/food24.glb');
useGLTF.preload('/models/grass401.glb');

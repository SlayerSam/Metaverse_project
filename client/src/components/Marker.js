'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export default function StandHereMarker({ position = [0, 0, 0], label = "Stand Here", avatarRef, setIsNear }) {
  const ringRef = useRef();
  const helperRef = useRef();
  const { scene } = useThree();

  useFrame(() => {
    if (avatarRef?.current && ringRef.current) {
      const avatarPosition = avatarRef.current.position;
      const qrPosition = new THREE.Vector3();
      ringRef.current.getWorldPosition(qrPosition);

      const distance = avatarPosition.distanceTo(qrPosition);
      setIsNear(distance < 2);
    }
  });

  // Pulsing ring animation
  useFrame((state) => {
    const scale = 1 + 0.05 * Math.sin(state.clock.elapsedTime * 4);
    if (ringRef.current) {
      ringRef.current.scale.set(scale, scale, scale);
      if (helperRef.current) {
        helperRef.current.update();
      }
    }
  });

  // Add mesh helper
  useEffect(() => {
    if (ringRef.current) {
      const boxHelper = new THREE.BoxHelper(ringRef.current, 0xffff00);
      helperRef.current = boxHelper;
      scene.add(boxHelper);

      return () => {
        scene.remove(boxHelper);
      };
    }
  }, [scene]);

  return (
    <>
      <group position={position}>
        <mesh
          ref={ringRef}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.4, 0]}
        >
          <ringGeometry args={[0.3, 0.5, 32]} />
          <meshStandardMaterial
            color="#00ffcc"
            emissive="#00ffcc"
            emissiveIntensity={5}
            side={THREE.DoubleSide}
          />
        </mesh>

        <Text
          position={[0, 1.4, 0]}
          fontSize={0.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>

    </>
  );
}

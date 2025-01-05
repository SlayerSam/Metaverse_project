'use client';

import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function ModelLoader({ modelPath, scale = 1, position = [0, 0, 0] }) {
    const { scene } = useGLTF(modelPath);

    return <primitive object={scene} scale={scale} position={position} />;
}

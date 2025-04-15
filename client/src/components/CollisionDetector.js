'use client'
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useObstacle } from '@/context/ObstacleContext';

export default function CollisionDetector() {
    const boxRef = useRef(new THREE.Box3());
    const { registerObstacle } = useObstacle();

    useEffect(() => {
        registerObstacle(boxRef.current);
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            const box = new THREE.Box3().setFromObject(meshRef.current);
            boxRef.current.copy(box);
        }
    });

    return null
}

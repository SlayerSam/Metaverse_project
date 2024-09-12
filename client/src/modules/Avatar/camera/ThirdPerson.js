import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThirdPersonCamera({ avatarRef, isMoving }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef({
        isDragging: false,
        prevMousePos: new THREE.Vector2(),
        azimuthAngle: 30,
        polarAngle: Math.PI / 4,
        distance: 8,
    });

    const calculateOffset = () => {
        const idealOffset = new THREE.Vector3(0, 0, -controlsRef.current.distance);
        idealOffset.applyAxisAngle(new THREE.Vector3(1, 0, 0), controlsRef.current.polarAngle);
        idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), controlsRef.current.azimuthAngle);
        if (avatarRef.current) {
            idealOffset.add(avatarRef.current.position);
        }
        return idealOffset;
    };

    const calculateLookAt = () => {
        const idealLookAt = new THREE.Vector3(0, 1, 0);
        if (avatarRef.current) {
            idealLookAt.add(avatarRef.current.position);
        }
        return idealLookAt;
    };

    const onDoubleCLick = (event) => {
        if (isMoving) return;
        controlsRef.current.isDragging = true;
        controlsRef.current.prevMousePos.set(event.clientX, event.clientY);
    };

    const onMouseUp = () => {
        if (isMoving) return;
        controlsRef.current.isDragging = false;
    };

    const onMouseMove = (event) => {
        if (isMoving || !controlsRef.current.isDragging) return;

        const deltaX = event.clientX - controlsRef.current.prevMousePos.x;
        const deltaY = event.clientY - controlsRef.current.prevMousePos.y;

        controlsRef.current.azimuthAngle -= deltaX * 0.005;
        controlsRef.current.polarAngle = Math.max(0.1, Math.min(Math.PI / 2, controlsRef.current.polarAngle - deltaY * 0.005));

        controlsRef.current.prevMousePos.set(event.clientX, event.clientY);
    };

    useEffect(() => {
        gl.domElement.addEventListener('dblclick', onDoubleCLick);
        gl.domElement.addEventListener('mouseup', onMouseUp);
        gl.domElement.addEventListener('mousemove', onMouseMove);

        return () => {
            gl.domElement.removeEventListener('dblclick', onDoubleCLick);
            gl.domElement.removeEventListener('mouseup', onMouseUp);
            gl.domElement.removeEventListener('mousemove', onMouseMove);
        };
    }, [gl.domElement, isMoving]);

    useFrame(() => {
        if (isMoving) {
            const idealOffset = calculateOffset();
            const idealLookAt = calculateLookAt();
            camera.position.lerp(idealOffset, 0.025);
            camera.lookAt(idealLookAt);
        } else if (!isMoving && controlsRef.current.isDragging) {
            const idealOffset = calculateOffset();
            const idealLookAt = calculateLookAt();
            camera.position.lerp(idealOffset, 0.025);
            camera.lookAt(idealLookAt);
        }
    });

    return null;
}

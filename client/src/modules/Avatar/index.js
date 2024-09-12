import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { AvatarModel } from './AvatarModel'

export function Avatar({ group, setBaseUrl, setIsMoving, isOpen }) {
    const { nodes, materials, animations } = useGLTF('/models/Avatar.glb')
    const { actions } = useAnimations(animations, group)
    const [keys, setKeys] = useState({})
    const { gl, scene, camera } = useThree();

    const speed = 0.1
    const rotationSpeed = 0.05;

    const handleKeyDown = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: true }))
    }

    const handleKeyUp = (event) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.code]: false }))
    }
    const handleClick = (event) => {
        if (isOpen) return
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const selectedObject = intersects[0].object;

            const distance = Math.floor(group.current.position.distanceTo(selectedObject.position));

            if (selectedObject.name === 'Cube006' && distance <= 7) {
                actions['Select'].play();
                setTimeout(() => {
                    actions['Select'].stop();
                    setBaseUrl(false);
                }, 900);
            }
        }
    };

    useFrame((state) => {
        if (isOpen) return
        let isMoving = false;
        const direction = new THREE.Vector3();
        const camera = state.camera;


        const head = group.current.getObjectByName('Head');
        group.current.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        if (keys['ArrowUp'] || keys['KeyW']) {
            group.current.position.add(direction.clone().multiplyScalar(speed));
            isMoving = true;
        }

        if (keys['ArrowDown'] || keys['KeyS']) {
            group.current.position.add(direction.clone().multiplyScalar(-speed));
            isMoving = true;
        }

        if (keys['ArrowLeft'] || keys['KeyA']) {
            group.current.rotation.y += rotationSpeed;
            isMoving = true;
        }

        if (keys['ArrowRight'] || keys['KeyD']) {
            group.current.rotation.y -= rotationSpeed;
            isMoving = true;
        }

        if (isMoving) {
            actions['Walking'].play();
            actions['Stand'].stop()
        } else {
            actions['Walking'].stop();
            actions['Stand'].play()
        }
        actions['Stand'].play()
        setIsMoving(isMoving)
    });

    useEffect(() => {
        if (isOpen) return
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        const handleObjectSelection = (event) => handleClick(event);
        window.addEventListener('click', handleObjectSelection);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('click', handleObjectSelection);
        };
    }, []);
    return (
        <AvatarModel nodes={nodes} group={group} materials={materials} />
    )
}
useGLTF.preload('/models/Avatar.glb')
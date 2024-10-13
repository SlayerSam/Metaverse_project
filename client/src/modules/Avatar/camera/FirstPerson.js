import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FirstPersonCamera({ headNode }) {
    const { camera } = useThree();

    useFrame(() => {
        if (!headNode) return; // Return if the head node is not available

        // Get the current head position in world space
        const headPosition = new THREE.Vector3().setFromMatrixPosition(headNode.matrixWorld);

        // Get the current head rotation (orientation) in world space
        const headQuaternion = new THREE.Quaternion().setFromRotationMatrix(headNode.matrixWorld);

        // Set the camera position to match the head position
        camera.position.copy(headPosition);

        // Create a direction for the camera to look at
        const lookAtDirection = new THREE.Vector3(0, 0, -1); // Forward direction relative to the head
        lookAtDirection.applyQuaternion(headQuaternion); // Apply the head's rotation to the direction

        // Set the target for the camera to look at based on the head's orientation
        const lookAtTarget = new THREE.Vector3().addVectors(headPosition, lookAtDirection);

        // Make the camera look at the target
        camera.lookAt(lookAtTarget);
    });

    return null; // The camera has no visual representation, so return null
}

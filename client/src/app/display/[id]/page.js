"use client";
import ModelLoader from '@/components/ModelLoader';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { useEffect, useRef, useState } from 'react';

const store = createXRStore();

export default function Page({ params }) {
    const { id } = params;
    const shirtModelRef = useRef();
    const [red, setRed] = useState(false);



    useEffect(() => {
        // Request AR session with body tracking support
        if (navigator.xr) {
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['anchors', 'tracked-body-joints']
            }).then((session) => {
                session.addEventListener('selectstart', (event) => {
                    setInterval(() => {

                        const joint = event.frame.getJointPose('spine');
                        if (joint && shirtModelRef.current) {
                            attachShirtToJoint(joint.transform);
                        }
                    }, 100)
                });
            }).catch((error) => {
                console.error('Failed to start AR session:', error);
            });
        } else {
            console.warn('WebXR not supported on this device.');
        }

        function attachShirtToJoint(transform) {
            shirtModelRef.current.position.set(transform.position.x, transform.position.y, transform.position.z);
            shirtModelRef.current.rotation.set(transform.orientation.x, transform.orientation.y, transform.orientation.z);
        }
    }, []);

    return (
        <>
            <button onClick={() => store.enterAR()}>Enter AR</button>
            <Canvas>
                <Environment preset="park" />

                <XR store={store}>
                    <ModelLoader
                        ref={shirtModelRef}
                        modelPath={'https://res.cloudinary.com/dyw5oov8w/image/upload/v1736008486/gjmzqjdjg2gondyoyz6w.glb'}
                        scale={0.5}
                        position={[0, 0, -2]}
                    />
                </XR>
            </Canvas>
        </>
    );
}

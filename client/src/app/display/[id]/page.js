// "use client";
// import ModelLoader from '@/components/ModelLoader';
// import { Environment } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { XR, createXRStore } from '@react-three/xr';
// import { useEffect, useRef, useState } from 'react';

// const store = createXRStore();

// export default function Page({ params }) {
//     const { id } = params;
//     const shirtModelRef = useRef();
//     const [red, setRed] = useState(false);
//     const [scaleFactor, setScaleFactor] = useState(0.5); // Initial scale value

//     useEffect(() => {
//         // Request AR session with body tracking support
//         if (navigator.xr) {
//             navigator.xr.requestSession('immersive-ar', {
//                 requiredFeatures: ['anchors', 'tracked-body-joints']
//             }).then((session) => {
//                 session.addEventListener('selectstart', (event) => {
//                     setInterval(() => {
//                         const joint = event.frame.getJointPose('spine');
//                         if (joint && shirtModelRef.current) {
//                             attachShirtToJoint(joint.transform);
//                         }
//                     }, 100);
//                 });
//             }).catch((error) => {
//                 console.error('Failed to start AR session:', error);
//             });
//         } else {
//             console.warn('WebXR not supported on this device.');
//         }

//         function attachShirtToJoint(transform) {
//             // Set position and rotation of the shirt model
//             shirtModelRef.current.position.set(
//                 transform.position.x,
//                 transform.position.y,
//                 transform.position.z
//             );
//             shirtModelRef.current.rotation.set(
//                 transform.orientation.x,
//                 transform.orientation.y,
//                 transform.orientation.z
//             );

//             // Adjust scale dynamically (example using spine joint distance as a factor)
//             const spineDistance = Math.max(0.5, Math.min(1.0, transform.position.y)); // Customize this based on realistic distances
//             const dynamicScale = spineDistance * 0.5; // Adjust the scaling factor for better fit
//             shirtModelRef.current.scale.set(dynamicScale, dynamicScale, dynamicScale);
//         }
//     }, []);

//     return (
//         <>
//             <button onClick={() => store.enterAR()}>Enter AR</button>
//             <Canvas>
//                 <Environment preset="park" />
//                 <XR store={store}>
//                     <ModelLoader
//                         ref={shirtModelRef}
//                         modelPath={'https://res.cloudinary.com/dyw5oov8w/image/upload/v1736008486/gjmzqjdjg2gondyoyz6w.glb'}
//                         scale={scaleFactor} // Initial scale
//                         position={[0, 0, -2]}
//                     />
//                 </XR>
//             </Canvas>
//         </>
//     );
// }
"use client";
import ModelLoader from '@/components/ModelLoader';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { XR, useXRFrame } from '@react-three/xr';
import { useEffect, useRef, useState } from 'react';

export default function Page({ params }) {
    const { id } = params;
    const shirtModelRef = useRef();
    const [scaleFactor, setScaleFactor] = useState(0.5);
    const [xrSession, setXRSession] = useState(null);

    useEffect(() => {
        if (navigator.xr) {
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['tracked-body-joints']
            }).then((session) => {
                setXRSession(session);
            }).catch((error) => {
                console.error('Failed to start AR session:', error);
            });
        } else {
            console.warn('WebXR not supported on this device.');
        }
    }, []);

    // Function to attach the model to the tracked body joint
    useXRFrame((frame) => {
        if (!xrSession || !shirtModelRef.current) return;

        // Get reference to the XR body tracking feature
        const jointSpace = xrSession.inputSources[0]?.hand?.get('spine');

        if (jointSpace) {
            const jointPose = frame.getJointPose(jointSpace);

            if (jointPose) {
                const { x, y, z } = jointPose.transform.position;
                const { x: rx, y: ry, z: rz } = jointPose.transform.orientation;

                // Attach shirt model to spine joint position
                shirtModelRef.current.position.set(x, y, z);
                shirtModelRef.current.rotation.set(rx, ry, rz);

                // Dynamic scaling based on body size (example: distance between neck and spine)
                const scale = Math.max(0.4, Math.min(1.2, y * 0.8));
                shirtModelRef.current.scale.set(scale, scale, scale);
            }
        }
    });

    return (
        <>
            <button onClick={() => xrSession && xrSession.requestReferenceSpace('local')}>Enter AR</button>
            <Canvas>
                <Environment preset="park" />
                <XR>
                    <ModelLoader
                        ref={shirtModelRef}
                        modelPath={'https://res.cloudinary.com/dyw5oov8w/image/upload/v1736008486/gjmzqjdjg2gondyoyz6w.glb'}
                        scale={scaleFactor}
                        position={[0, 0, -2]}
                    />
                </XR>
            </Canvas>
        </>
    );
}

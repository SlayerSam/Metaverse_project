"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { XR, ARButton, createXRStore } from "@react-three/xr";
import { Environment, useGLTF } from "@react-three/drei";
import * as tf from "@tensorflow/tfjs-core";
import * as handpose from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

function WatchModel({ wristPosition }) {
    const { scene } = useGLTF(
        "https://res.cloudinary.com/dyw5oov8w/image/upload/v1736008486/gjmzqjdjg2gondyoyz6w.glb"
    );
    const ref = useRef();

    useEffect(() => {
        const update = () => {
            if (ref.current && wristPosition.current) {
                const { x, y } = wristPosition.current;
                ref.current.position.set(x, y, -2); // Push into scene
            }
        };
        const interval = setInterval(update, 30);
        return () => clearInterval(interval);
    }, []);

    return <primitive ref={ref} object={scene} scale={1.0} />;
}

export default function Page({ params }) {
    const videoRef = useRef(null);
    const wristPosition = useRef({ x: 0, y: 0 });
    const store = createXRStore()
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function init() {
            await tf.setBackend("webgl");
            const detector = await handpose.createDetector(
                handpose.SupportedModels.MediaPipeHands,
                {
                    runtime: "tfjs",
                    modelType: "lite",
                }
            );

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });

            videoRef.current.srcObject = stream;
            await videoRef.current.play();

            async function detect() {
                if (!videoRef.current) return;

                const hands = await detector.estimateHands(videoRef.current);
                if (hands.length > 0) {
                    const wrist = hands[0].keypoints.find((k) => k.name === "wrist");
                    if (wrist) {
                        const x = (wrist.x / videoRef.current.videoWidth) * 2 - 1;
                        const y = -(wrist.y / videoRef.current.videoHeight) * 2 + 1;
                        wristPosition.current = { x, y };
                    }
                }

                requestAnimationFrame(detect);
            }

            detect();
            setReady(true);
        }

        init();
    }, []);

    return (
        <>
            <video
                ref={videoRef}
                style={{ display: "none" }}
                playsInline
                muted
                autoPlay
            />
            <button onClick={() => store.enterAR()}>Enter AR</button>
            <Canvas>
                <XR store={store}>
                    <ambientLight />
                    <Environment preset="sunset" />
                    {ready && <WatchModel wristPosition={wristPosition} />}
                </XR>
            </Canvas>
        </>
    );
}

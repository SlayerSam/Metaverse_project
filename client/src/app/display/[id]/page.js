"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR, ARButton, createXRStore } from "@react-three/xr";
import { Environment, useGLTF, Html } from "@react-three/drei";
import * as tf from "@tensorflow/tfjs-core";
import * as handpose from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

const ProductConfig = {
    WATCH: {
        anchorPoint: "wrist",
        scale: 1.0,
        positionOffset: { x: 0, y: 0, z: -2 },
        rotationOffset: { x: 0, y: 0, z: 0 },
        detectionMethod: "hand"
    }
};

export default function Page({ params }) {
    const modelUrl = "https://res.cloudinary.com/dyw5oov8w/image/upload/v1736008486/gjmzqjdjg2gondyoyz6w.glb";
    const productType = "WATCH";

    const videoRef = useRef(null);
    const trackingData = useRef({ x: 0, y: 0 });
    const store = createXRStore();
    const detectorRef = useRef(null);
    const [videoReady, setVideoReady] = useState(false);
    const [modelVisible, setModelVisible] = useState(false);
    const [trackingStatus, setTrackingStatus] = useState("Searching for hand...");
    const [directionHint, setDirectionHint] = useState("");

    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cameraAllowed, setCameraAllowed] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);

    const config = ProductConfig[productType.toUpperCase()] || ProductConfig.WATCH;

    // Initialize AR experience after video element is confirmed ready
    useEffect(() => {
        if (!videoReady) return;

        let detectionFrame;
        let stream;

        async function initAR() {
            try {
                setLoading(true);

                // Initialize TensorFlow
                await tf.setBackend("webgl");
                await tf.ready();

                // Initialize hand detector
                detectorRef.current = await handpose.createDetector(
                    handpose.SupportedModels.MediaPipeHands,
                    { runtime: "tfjs", modelType: "lite" }
                );

                // Get camera stream
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: "user",
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                    });
                    setCameraAllowed(true);

                    // Assign stream to video element
                    videoRef.current.srcObject = stream;

                    // Wait for video to be ready
                    await new Promise((resolve, reject) => {
                        videoRef.current.onloadedmetadata = resolve;
                        videoRef.current.onerror = reject;
                    });

                    await videoRef.current.play();
                } catch (err) {
                    setError("Camera access denied. Please enable camera permissions.");
                    setCameraAllowed(false);
                    throw err;
                }

                // Detection loop
                async function detect() {
                    if (!videoRef.current || !detectorRef.current || !cameraAllowed) return;

                    try {
                        const hands = await detectorRef.current.estimateHands(videoRef.current);
                        if (hands.length > 0) {
                            const anchorPoint = hands[0].keypoints.find(k => k.name === config.anchorPoint) ||
                                hands[0].keypoints[0];

                            if (anchorPoint) {
                                const x = (anchorPoint.x / videoRef.current.videoWidth) * 2 - 1;
                                const y = -(anchorPoint.y / videoRef.current.videoHeight) * 2 + 1;
                                trackingData.current = { x, y };
                                setModelVisible(true);
                                setTrackingStatus("Tracking successfully!");
                                setDirectionHint("");
                            } else {
                                setModelVisible(false);
                                setTrackingStatus("Move your hand into view");
                            }
                        } else {
                            setModelVisible(false);
                            setTrackingStatus("Searching for hand...");
                            // Calculate direction hint based on last known position
                            if (trackingData.current.x !== 0 || trackingData.current.y !== 0) {
                                const hintX = trackingData.current.x > 0 ? "left" : "right";
                                const hintY = trackingData.current.y > 0 ? "down" : "up";
                                setDirectionHint(`Try moving ${hintY} and ${hintX}`);
                            }
                        }
                    } catch (e) {
                        console.error("Detection error:", e);
                    }

                    detectionFrame = requestAnimationFrame(detect);
                }

                detect();
                setReady(true);
            } catch (err) {
                console.error("AR initialization failed:", err);
                setError(err.message || "Failed to initialize AR");
            } finally {
                setLoading(false);
                setTimeout(() => setShowInstructions(false), 5000);
            }
        }

        initAR();

        return () => {
            if (detectionFrame) cancelAnimationFrame(detectionFrame);
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (detectorRef.current) detectorRef.current.dispose();
        };
    }, [videoReady, cameraAllowed, config, productType]);

    // This effect ensures the video element is properly mounted
    useEffect(() => {
        if (videoRef.current) {
            setVideoReady(true);
        }
    }, []);

    function ARModel() {
        const { scene } = useGLTF(modelUrl);
        const ref = useRef();

        useEffect(() => {
            useGLTF.preload(modelUrl);
        }, [modelUrl]);

        useFrame(() => {
            if (ref.current && trackingData.current) {
                const { x, y } = trackingData.current;
                console.log(trackingData.current, x, y)
                ref.current.position.set(
                    x + config.positionOffset.x,
                    y + config.positionOffset.y,
                    config.positionOffset.z
                );
                ref.current.rotation.set(
                    config.rotationOffset.x,
                    config.rotationOffset.y,
                    config.rotationOffset.z
                );
            };
        });

        return <primitive ref={ref} object={scene} scale={config.scale} />;
    }

    return (
        <>
            <video
                ref={videoRef}
                style={{ display: "none" }}
                playsInline
                muted
                autoPlay
                onLoadedMetadata={() => setVideoReady(true)}
                onError={() => setError("Failed to load video element")}
            />

            {loading ? (
                <div className="ar-loading">
                    <div className="spinner"></div>
                    <p>Initializing AR experience...</p>
                </div>
            ) : error ? (
                <div className="ar-error">
                    <h3>Error Loading AR</h3>
                    <p>{error}</p>
                    {!cameraAllowed && (
                        <button onClick={() => window.location.reload()}>
                            Reload and Allow Camera
                        </button>
                    )}
                </div>
            ) : (
                <div className="ar-try-on-container">
                    {/* Tracking status overlay */}
                    <div className="tracking-overlay">
                        <div className={`tracking-status ${modelVisible ? "success" : "searching"}`}>
                            {trackingStatus}
                            {directionHint && <div className="direction-hint">↳ {directionHint}</div>}
                        </div>
                        {!modelVisible && (
                            <div className="tracking-indicator">
                                <div className="pulse-ring"></div>
                                <div className="center-dot"></div>
                                <div className="direction-arrow"></div>
                            </div>
                        )}
                    </div>

                    <Canvas>
                        <XR store={store}>
                            <ambientLight intensity={0.7} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <Environment preset="city" />
                            {ready && <ARModel />}
                            {showInstructions && (
                                <Html center>
                                    <div className="ar-instructions">
                                        <h3>AR Try-On Instructions</h3>
                                        <p>Move slowly to position the {productType.toLowerCase()}</p>
                                        <p>Tap the button below to enter AR mode</p>
                                    </div>
                                </Html>
                            )}
                        </XR>
                    </Canvas>
                    <div className="ar-controls">
                        <button
                            onClick={() => store.enterAR({
                                requiredFeatures: ['hit-test'],
                                optionalFeatures: ['dom-overlay'],
                                domOverlay: { root: document.body },
                            })}
                            className="ar-button"
                        >
                            Start AR
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .tracking-overlay {
                    position: fixed;
                    top: 20px;
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 1000;
                    pointer-events: none;
                }
                .tracking-status {
                    padding: 8px 16px;
                    border-radius: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    font-size: 14px;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }
                .tracking-status.success {
                    background: rgba(46, 125, 50, 0.7);
                }
                .tracking-status.searching {
                    background: rgba(198, 40, 40, 0.7);
                }
                .direction-hint {
                    font-size: 12px;
                    opacity: 0.8;
                    margin-top: 4px;
                }
                .tracking-indicator {
                    position: relative;
                    width: 100px;
                    height: 100px;
                }
                .pulse-ring {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border: 3px solid rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                .center-dot {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                }
                .direction-arrow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 30px;
                    height: 30px;
                    transform: translate(-50%, -50%) rotate(45deg);
                    border-right: 3px solid white;
                    border-top: 3px solid white;
                    opacity: 0.7;
                    animation: bounce 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.7; }
                    70% { transform: scale(1.3); opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translate(-50%, -50%) rotate(45deg) scale(1); }
                    50% { transform: translate(-50%, -50%) rotate(45deg) scale(1.2); }
                }
            `}</style>
        </>
    );
}
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const colors = ["#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D"];

export default function LoadingOverlay({ isActive, onFinish }) {
    const [phase, setPhase] = useState("slide");

    useEffect(() => {
        if (!isActive) return;

        setPhase("slide");
        const slideTimer = setTimeout(() => {
            setPhase("spinner");
            const loaderTimer = setTimeout(() => {
                setPhase("done");
                onFinish();
            }, 1500); // Spinner duration
            return () => clearTimeout(loaderTimer);
        }, 1000); // Slide duration

        return () => clearTimeout(slideTimer);
    }, [isActive, onFinish]);

    if (!isActive || phase === "done") return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center overflow-hidden">
            {phase === "slide" && (
                <div className="absolute inset-0 flex">
                    {colors.map((color, i) => (
                        <motion.div
                            key={i}
                            className="flex-1"
                            style={{ backgroundColor: color }}
                            initial={{ y: "-100%" }}
                            animate={{ y: "0%" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        />
                    ))}
                </div>
            )}
            {phase === "spinner" && (
                <motion.div
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </div>
    );
}

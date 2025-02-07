import { useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function QRPlane({ url, index, avatarRef, onNear, setProduct, data }) {
    const texture = useTexture(url);
    const [isNear, setIsNear] = useState(false);
    const meshRef = useRef();

    useFrame(() => {
        if (avatarRef?.current && meshRef.current) {
            const avatarPosition = avatarRef.current.position;
            const qrPosition = meshRef.current.position;

            const distance = avatarPosition.distanceTo(qrPosition);

            if (distance < 2) {
                if (!isNear) {
                    setIsNear(true);
                    onNear(true);
                    setProduct(data)
                }
            } else {
                if (isNear) {
                    setIsNear(false);
                    onNear(false);
                    setProduct({})
                }
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[index * 3, 1, 3]} name={'qrcode' + index}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
    );
}

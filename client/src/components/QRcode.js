const { useTexture } = require("@react-three/drei");
const THREE = require("three");

export default function QRPlane({ url }) {
    const texture = useTexture(url); // Dynamically load the QR code texture

    return (
        <mesh position={[0, 1, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
    );
};
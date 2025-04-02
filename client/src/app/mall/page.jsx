'use client';
import { Canvas } from '@react-three/fiber';
import SampleBase from '@/modules/Base/SampleBase';

export default function MallPage() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      background: 'linear-gradient(to bottom, #87CEEB, #E0F7FA)' // Optional sky gradient
    }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 10, 20], 
          fov: 50,
          near: 0.1,
          far: 1000 
        }}
        gl={{ alpha: false }} // Disable transparent background
      >
        <SampleBase />
      </Canvas>
    </div>
  );
}
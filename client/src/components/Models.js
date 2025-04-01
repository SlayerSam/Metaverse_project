import { useGLTF } from '@react-three/drei';

export default function Models() {
  const { scene: store1 } = useGLTF('/models/store1.glb');
  const { scene: store2 } = useGLTF('/models/store2.glb');

  return (
    <>
      <primitive object={store1} position={[-10, 0, 0]} />
      <primitive object={store2} position={[10, 0, 0]} />
    </>
  );
}

// Preload models
useGLTF.preload('/models/store1.glb');
useGLTF.preload('/models/store2.glb');
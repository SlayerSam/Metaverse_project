// 'use client'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls, FirstPersonControls, useGLTF, useAnimations } from '@react-three/drei'
// import { Suspense, useRef, useState, useEffect } from 'react'
// import * as THREE from 'three'

// const BuildingModel = () => {
//   const { scene } = useGLTF('/models/metaverse.glb')
//   return <primitive object={scene} />
// }

// const AvatarModel = ({ actions }) => {
//   const { scene } = useGLTF('/models/Avatar.glb')

//   // Play the walking animation by default
//   useEffect(() => {
//     if (actions && actions['Walking']) {
//       actions['Walking'].play(); // Replace 'Walking' with the actual name of your animation
//     }
//   }, [actions]);

//   return <primitive object={scene} />
// }

// const Avatar = ({ position, keys, actions }) => {
//   const avatarRef = useRef()
//   const speed = 0.1
//   const direction = new THREE.Vector3()

//   useFrame(() => {
//     // Reset direction
//     direction.set(0, 0, 0)

//     // Check for key presses
//     if (keys.w) direction.z -= speed
//     if (keys.s) direction.z += speed
//     if (keys.a) direction.x -= speed
//     if (keys.d) direction.x += speed

//     // Normalize direction to maintain consistent speed
//     if (direction.length() > 0) {
//       direction.normalize()
//       avatarRef.current.position.add(direction)

//       // Play walking animation
//       if (actions && actions['Walking']) {
//         actions['Walking'].play(); // Replace 'Walking' with the actual name of your animation
//       }
//     } else {
//       // Stop walking animation if not moving
//       if (actions && actions['Walking']) {
//         actions['Walking'].stop();
//       }
//     }

//     // Ensure the avatar stays on the ground
//     avatarRef.current.position.y = 0.75; // Set to a fixed height above the ground
//   })

//   return (
//     <mesh ref={avatarRef} position={position}>
//       <AvatarModel actions={actions} />
//     </mesh>
//   )
// }

// // Custom hook for keyboard controls
// const useKeyboardControls = (setKeys) => {
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       setKeys(prev => ({ ...prev, [event.key]: true }));
//     };

//     const handleKeyUp = (event) => {
//       setKeys(prev => ({ ...prev, [event.key]: false }));
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [setKeys]);
// };

// const Scene = ({ isFirstPerson, avatarRef, keys }) => {
//   const [scrollSpeed, setScrollSpeed] = useState(0)

//   // Handle scroll for camera movement
//   useEffect(() => {
//     const handleScroll = (event) => {
//       // Adjust scroll speed based on the scroll delta
//       setScrollSpeed((prev) => Math.max(prev + event.deltaY * -0.01, 0));
//     };

//     window.addEventListener('wheel', handleScroll, { passive: true });

//     return () => {
//       window.removeEventListener('wheel', handleScroll);
//     };
//   }, []);

//   useFrame((state) => {
//     const camera = state.camera
//     if (isFirstPerson && avatarRef.current) {
//       // Set the camera position to the avatar's position
//       const cameraPosition = avatarRef.current.position.clone()
//       cameraPosition.y += 1.5; // Adjust height to eye level (1.5 meters above the ground)

//       // Move the camera forward/backward based on scroll speed
//       camera.position.copy(cameraPosition);
//       camera.position.z += scrollSpeed; // Move camera based on scroll speed
//       camera.lookAt(avatarRef.current.position); // Make the camera look at the avatar
//     }
//   });

//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
//       <Suspense fallback={null}>
//         <BuildingModel />
//         <Avatar ref={avatarRef} position={[0, 0.75, 0]} keys={keys} actions={null} />
//       </Suspense>
//       {isFirstPerson ? (
//         <FirstPersonControls 
//           movementSpeed={1} 
//           lookSpeed={0.1} 
//           lookVertical={true} 
//           activeLook={true} 
//         />
//       ) : (
//         <OrbitControls 
//           target={[0, 0.75, 0]} 
//           enableZoom={true} 
//           enablePan={true} 
//           minDistance={2} 
//           maxDistance={10} 
//         />
//       )}
//     </>
//   );
// };

// export default function Home() {
//   const [isFirstPerson, setIsFirstPerson] = useState(true)
//   const [keys, setKeys] = useState({})
//   const avatarRef = useRef()

//   const toggleCamera = () => {
//     setIsFirstPerson(prev => !prev)
//   }

//   // Use the keyboard controls hook
//   useKeyboardControls(setKeys);

//   return (
//     <div className="h-screen w-screen relative">
//       <button 
//         onClick={toggleCamera} 
//         className="absolute top-5 left-5 z-10 bg-white p-2 rounded shadow"
//       >
//         Switch to {isFirstPerson ? 'Third Person' : 'First Person'}
//       </button>
//       <Canvas id="canvas" shadows camera={{ position: [0, 1.5, 5], fov: 75 }}>
//         <Scene isFirstPerson={isFirstPerson} avatarRef={avatarRef} keys={keys} />
//       </Canvas>
//     </div>
//   )
// }


import GameScene from '@/modules/Scene'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-screen'>
      <GameScene />
    </div>
  )
}

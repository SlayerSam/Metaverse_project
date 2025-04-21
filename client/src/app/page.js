'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Environment, Sparkles } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Scene() {
  return (
    <>
      <Environment preset="city" />
      <Sparkles count={100} scale={10} size={2} speed={0.5} />

      <group position={[0, -2, 0]}>
        {/* Mall Building */}
        <Float floatIntensity={2} speed={2}>
          <mesh position={[-2, 0, 0]} castShadow>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#ff6b6b" metalness={0.5} roughness={0.2} />
          </mesh>
        </Float>

        {/* Central Tower */}
        <Float floatIntensity={2} speed={1.5}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1, 3, 1]} />
            <meshStandardMaterial color="#4ecdc4" metalness={0.5} roughness={0.2} />
          </mesh>
        </Float>

        {/* Shopping Center */}
        <Float floatIntensity={2} speed={2.5}>
          <mesh position={[2, 0, 0]} castShadow>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="#ffe66d" metalness={0.5} roughness={0.2} />
          </mesh>
        </Float>
      </group>

      {/* Add some ambient and directional light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      <OrbitControls enableZoom={false} />
    </>
  )
}

export default function Home() {
  const router = useRouter()
  const [hovering, setHovering] = useState(false)

  return (
    <div className="w-full h-screen relative">
      {/* 3D Canvas */}
      <Canvas
        className="w-full h-full bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364]"
        camera={{ position: [0, 0, 5], fov: 75 }}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full">
        <nav className="flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-white">MetaBazaar</div>
          <div className="space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">Home</Link>
            <Link href="/about" className="text-white hover:text-gray-300">About</Link>
            <Link href="/main" className="inline-block">
              <button
                className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={() => router.push('/play')}
              >
                Enter Metaverse
              </button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Center Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Welcome to the Future
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            of Shopping
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
          Step into a revolutionary 3D shopping experience where the digital and physical worlds converge.
        </p>
        <Link href="/main">
          <button
            className={`bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold 
              border border-white/20 transition-all duration-300
              ${hovering ? 'bg-white/20 scale-105' : 'hover:bg-white/20 hover:scale-105'}`}
            onClick={() => router.push('/play')}
          >
            Enter Metaverse
          </button>
        </Link>
      </div>
    </div>
  )
}

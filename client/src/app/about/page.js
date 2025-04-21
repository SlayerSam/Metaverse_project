'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, Sparkles, MeshDistortMaterial, Box } from '@react-three/drei';

// Multiple Vertical Rectangular Boxes
function FloatingPillars() {
  return (
    <>
      <Float floatIntensity={1.5} speed={2}>
        <Box args={[0.5, 3, 0.5]} position={[-2, 0, -5]}>
          <meshStandardMaterial color="#ff69b4" metalness={0.6} roughness={0.3} />
        </Box>
      </Float>
      <Float floatIntensity={1.5} speed={2}>
        <Box args={[0.5, 4, 0.5]} position={[0, 0.5, -5]}>
          <meshStandardMaterial color="#00ffff" metalness={0.6} roughness={0.3} />
        </Box>
      </Float>
      <Float floatIntensity={1.5} speed={2}>
        <Box args={[0.5, 2.5, 0.5]} position={[2, -0.5, -5]}>
          <meshStandardMaterial color="#ffa500" metalness={0.6} roughness={0.3} />
        </Box>
      </Float>
    </>
  );
}

// Scene Component
function Scene() {
  return (
    <>
      {/* Default HDRi Environment preset: "city" */}
      <Environment preset="sunset" background />
      <Sparkles count={200} scale={20} size={2} speed={1} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

export default function About() {
  return (
    <div className="min-h-screen relative">
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-white opacity-80 -z-10" />

      {/* 3D Canvas */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10 px-6 py-12">
        <h1 className="text-5xl font-bold text-black mb-6 drop-shadow-lg">Welcome to MetaBaazaar</h1>
        <p className="text-lg md:text-xl text-black mb-10 drop-shadow-lg">
          Welcome to MetaBaazaar, the first fully immersive shopping destination in the metaverse, where convenience meets cutting-edge technology. Explore a vibrant virtual world that blends the excitement of shopping with the limitless possibilities of digital space.
        </p>
        <p className="text-lg md:text-xl text-black mb-10 drop-shadow-lg">
          Our mall offers a wide range of stores, from high-end fashion to tech gadgets, all designed with hyper-realistic 3D models and rich details to provide an unparalleled shopping experience. Whether you’re browsing for the latest trends or discovering exclusive products, our virtual mall is designed to cater to every shopper's needs in a space that feels as real as your favorite shopping district.
        </p>

        <h2 className="text-3xl font-semibold text-black mb-6 drop-shadow-lg">Why We Are Different</h2>
        <p className="text-lg md:text-xl text-black mb-10 drop-shadow-lg">
          At MetaBaazaar, we don’t just offer a place to shop – we provide an experience. Unlike traditional online shopping or other virtual stores, our mall is designed to be a fully interactive environment where you can not only browse products but also engage with others, attend live events, and explore digital storefronts that offer more than just items.
        </p>
        <p className="text-lg md:text-xl text-black mb-10 drop-shadow-lg">
          Our cutting-edge 3D design ensures that every detail, from the architecture to the smallest product feature, is as realistic and captivating as possible. Plus, with seamless integration of social features, you can shop with friends, attend virtual fashion shows, or even interact directly with brand representatives in real-time. It’s a whole new way to shop, socialize, and experience retail in the digital world.
        </p>

        <p className="text-lg md:text-xl text-black mb-10 drop-shadow-lg">
          Step into a world of endless possibilities, where you can shop, explore, and socialize, all without leaving your home. Join us in reshaping the future of retail in the metaverse.
        </p>

        <div className="mt-10">
          <Link href="/" className="inline-block">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all border border-white/20">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

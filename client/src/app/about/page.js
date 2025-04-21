'use client'
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sparkles } from '@react-three/drei';
import Image from 'next/image';

// 3D Scene Component with lighting, sparkles, and environment
function Scene() {
  return (
    <>
      {/* <Environment preset="sunset"/> */}
      <Sparkles count={200} scale={20} size={2} speed={1} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <OrbitControls enableZoom={false} />
    </>
  );
}

// Feature section with optional reversed layout
const FeatureSection = ({ title, description, imageUrl, reverse = false }) => {
  return (
    <section
      className={`py-16 px-6 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'
        } items-center gap-12 max-w-6xl mx-auto`}
    >
      <div className="md:w-1/2">
        <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-2xl border-2 border-white/30">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
      <div className="md:w-1/2">
        <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-md">{title}</h3>
        <p className="text-lg text-white/90">{description}</p>
      </div>
    </section>
  );
};

export default function About() {
  const features = [
    {
      title: 'Virtual Try-On Experience',
      description:
        'Try before you buy with our advanced virtual fitting rooms. See how clothes, accessories, and even furniture look on you or in your space with realistic 3D rendering.',
      imageUrl:
      "https://media.istockphoto.com/id/1371210035/vector/metaverse-virtual-reality-shopping-woman-wearing-vr-goggle-having-3d-experience-in-shopping.jpg?s=612x612&w=0&k=20&c=NUnuN2GADB5VT5pQXDC63Bk7PtoKCAte_-Pw-vL-NzU="
    },
    {
      title: 'Immersive VR Shopping',
      description:
        'Step into our fully immersive virtual reality mall. Navigate beautifully designed stores and interact with products in 3D space.',
      imageUrl:
        'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=2078&q=80',
      reverse: true,
    },
    {
      title: 'Real-Time Communication',
      description:
        'Chat with friends, consult with store assistants, or join live shopping events with spatial audio and video features.',
      imageUrl:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2070&q=80',
    },
    {
      title: 'Blockchain-Powered Ownership',
      description:
        'Shop exclusive digital collectibles, limited-edition virtual items, and verify product authenticity with blockchain-backed receipts — all within our futuristic mall.',
      imageUrl:
        'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=2071&q=80',
      reverse: true,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated Futuristic Gradient Background */}
      <style jsx>{`
        .bg-futuristic {
          background: linear-gradient(135deg, #1a004e, #440b8f, #00c3ff);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="absolute inset-0 bg-futuristic opacity-90 -z-20" />

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} shadows>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center relative z-10 px-6 py-20">
        <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Welcome to MetaBazaar</h1>
        <p className="text-xl text-white/90 mb-10">
          The future of shopping is here. Step into our metaverse mall where cutting-edge technology
          creates an immersive retail experience.
        </p>
      </div>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          title={feature.title}
          description={feature.description}
          imageUrl={feature.imageUrl}
          reverse={feature.reverse}
        />
      ))}

      {/* Call to Action */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-md">Ready to Experience the Future?</h2>
        <Link href="/explore">
          <button className="bg-white text-indigo-900 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-100 border border-white/20 text-lg shadow-xl transform hover:scale-105 transition-transform">
            Enter the Metaverse Mall
          </button>
        </Link>
      </div>
    </div>
  );
}

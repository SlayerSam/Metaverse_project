'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import AvatarDisplayModelOnly from '@/components/AvatarDisplayOnlyModel';
import productsList from '@/lib/products.json';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetFemaleAvatar, resetMaleAvatar, updateFemaleAvatar, updateMaleAvatar } from '@/redux/slices/avatarSlice';

export default function page() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const type = searchParams.get('type'); // Extract `type`
    const gender = searchParams.get('gender');
    const { maleAvatar, femaleAvatar } = useSelector(state => state.avatar);
    const { avatar } = useSelector(state => state.user)
    const [index, setIndex] = useState(2); // Start centered
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState(null)

    useEffect(() => {
        setProducts(
            productsList.filter(
                (product) => product.category === type && product.gender === gender
            )
        )
    }, [])
    const swipe = (dir) => {
        setIndex((prev) => {
            const next = dir === 'left' ? prev - 1 : prev + 1;
            return Math.min(Math.max(next, 0), products.length - 1);
        });
    };

    const getStateType = (category) => {
        if (category === 'shirt') return 'shirtModelUrl';
        if (category === 'pant') return 'pantModelUrl';
        return '';
    };

    const checkProductUrl = () => {
        const { model, category, gender } = product;
        if (gender === 'male') {
            return maleAvatar[getStateType(category)] === model;
        } else {
            return femaleAvatar[getStateType(category)] === model;
        }
    };

    useEffect(() => {
        setProduct(products[index])
        if (product)
            updateModels()
    }, [index])

    const updateModels = () => {
        const stateKey = getStateType(product.category);
        if (product.gender === 'male') {
            if (checkProductUrl()) dispatch(resetMaleAvatar());
            else dispatch(updateMaleAvatar({ [stateKey]: product.model }));
        } else {
            if (checkProductUrl()) dispatch(resetFemaleAvatar());
            else dispatch(updateFemaleAvatar({ [stateKey]: product.model }));
        }
    };


    return (
        <div className="relative h-screen overflow-hidden grid items-center bg-white">

            <div className="absolute top-4 left-4 z-40">
                <button
                    onClick={() => router.replace('/play')}
                    className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                    ⬅ Back
                </button>
            </div>
            <div className="absolute top-8 w-full text-center z-30">
                <h2 className="text-3xl font-bold text-gray-800 drop-shadow-md mb-2">
                    {product?.title}
                </h2>
                <p className="text-lg text-gray-600 mb-4">{product?.price ? product.price + '/-' : ''}</p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                        {products?.map((card, i) => {
                            const offset = i - index;
                            if (offset === 0) return null;

                            const scale = 1;
                            const opacity = 1;
                            const zIndex = 10 - Math.abs(offset);
                            const translateX = offset * 500;

                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        x: translateX,
                                        scale,
                                        opacity,
                                        zIndex,
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className="absolute w-[450px] h-[400px] rounded-2xl shadow-lg z-20 flex flex-col justify-center items-center cursor-pointer overflow-hidden"
                                    style={{ backgroundColor: '#fff' }}
                                >
                                    <div
                                        className="w-full h-full"
                                    >
                                        <ProductCard product={card} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Canvas
                className="absolute inset-0 z-0"
                camera={{ position: [0, 0, 6], fov: 30 }}
                shadows
            >
                <Environment preset='city' />
                <ambientLight intensity={0.6} />
                <directionalLight position={[0, 10, 5]} intensity={0.8} castShadow />
                <spotLight position={[0, 5, 5]} angle={0.1} penumbra={1} intensity={0.7} castShadow />
                <AvatarDisplayModelOnly modelPath="/models/Avatar.glb" avatar={avatar} />
                <mesh
                    position={[0, 0, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[1, 1, 1]}
                    receiveShadow
                    castShadow
                >
                    <circleGeometry args={[5, 32]} />
                    <meshStandardMaterial color="lightgray" />
                </mesh>
                <OrbitControls
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                    makeDefault
                    enableZoom={false}
                    enablePan={false}
                />
            </Canvas>

            {/* Navigation Buttons */}
            <div className="absolute inset-0 top-1/2 h-fit flex items-center justify-between px-4">
                <button
                    onClick={() => swipe('left')}
                    disabled={index === 0}
                    className="bg-white shadow-lg px-4 py-2 rounded-full z-30"
                >
                    ⬅️
                </button>
                <button
                    onClick={() => swipe('right')}
                    disabled={index === products.length - 1}
                    className="bg-white shadow-lg px-4 py-2 rounded-full z-30"
                >
                    ➡️
                </button>
            </div>
        </div>
    );
}

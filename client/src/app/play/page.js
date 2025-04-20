'use client'
import ChatRoom from '@/components/ChatRoom'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { ObstacleProvider } from '@/context/ObstacleContext'
import Scene from '@/modules/Scene'
import React, { useState } from 'react'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [onNear, setOnNear] = useState(false)
  const [product, setProduct] = useState({})
  return (
    <ObstacleProvider>
      <div className='w-full h-screen relative'>
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} setIsFirstPerson={setIsFirstPerson} />
        <ProductCard onNear={onNear} product={product} />
        <Scene isOpen={isOpen} setOnNear={setOnNear} isFirstPerson={isFirstPerson} setProduct={setProduct} />
        <ChatRoom />
      </div>
    </ObstacleProvider>
  )
}
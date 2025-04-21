'use client'
import ChatRoom from '@/components/ChatRoom'
import Navbar from '@/components/Navbar'
import { ObstacleProvider } from '@/context/ObstacleContext'
import Scene from '@/modules/Scene'
import React, { useState } from 'react'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  return (
    <ObstacleProvider>
      <div className='w-full h-screen relative'>
        <Navbar setIsOpen={setIsOpen} isOpen={isOpen} setIsFirstPerson={setIsFirstPerson} />
        <Scene isOpen={isOpen} isFirstPerson={isFirstPerson} />
        <ChatRoom />
      </div>
    </ObstacleProvider>
  )
}
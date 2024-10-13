'use client'
import Navbar from '@/components/Navbar'
import Scene from '@/modules/Scene'
import React, { useState } from 'react'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  return (
    <div className='w-full h-screen'>
      <Navbar setIsOpen={setIsOpen} isOpen={isOpen} setIsFirstPerson={setIsFirstPerson} />
      <Scene isOpen={isOpen} isFirstPerson={isFirstPerson} />
    </div>
  )
}
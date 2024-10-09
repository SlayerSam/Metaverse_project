'use client'
import Navbar from '@/components/Navbar'
import Scene from '@/modules/Scene'
import React, { useState } from 'react'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='w-full h-screen'>
      <Navbar setIsOpen={setIsOpen} />
      <Scene isOpen={isOpen} />
    </div>
  )
}
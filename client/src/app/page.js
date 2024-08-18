'use client'
import Navbar from '@/components/Navbar'
import Scene from '@/modules/Scene'
import React from 'react'

export default function page() {
  return (
    <div className='w-full h-screen'>
      <Navbar />
      <Scene />
    </div>
  )
}

import React from 'react'
import Configuration from './AvatarConfigurator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AvatarDisplay from './AvatarDisplay'
import { Environment } from '@react-three/drei'
import { Canvas } from 'react-three-fiber'

const formSchema = z.object({
    color: z.string().min(2, {
        message: "Color field cannot be empty.",
    }),
})

export default function AvatarConfigurator() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            color: '#ffffff',
            left_arm: 50,
        },
    })
    return (
        <div className='flex w-full'>

            <div className='w-1/2 min-h-[550px] flex justify-center items-center'>
                <Canvas shadows className='flex justify-center items-center' camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }} >
                    <Environment files='/models/base.hdr' />
                    <pointLight position={[10, 10, 100]} />
                    <ambientLight intensity={0.9} />
                    <AvatarDisplay form={form} />
                </Canvas>
            </div>
            <div className='w-1/2'>
                <Configuration form={form} />
            </div>
        </div>
    )
}
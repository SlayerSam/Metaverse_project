import React from 'react'
import Configuration from './AvatarConfigurator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AvatarDisplay from './AvatarDisplay'
import { Environment } from '@react-three/drei'
import { Canvas } from 'react-three-fiber'

const formSchema = z.object({
    hairColor: z.string().min(2, {
        message: "Color field cannot be empty.",
    }),
    shirtColor: z.string().min(2, {
        message: "Color field cannot be empty.",
    }),
    pantColor: z.string().min(2, {
        message: "Color field cannot be empty.",
    }),
    shoesColor: z.string().min(2, {
        message: "Color field cannot be empty.",
    }),
    left_arm: z.number().min(0, {
        message: "Arm size must be a positive number.",
    })
})

export default function AvatarConfigurator({ next }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            hairColor: '#000000',
            shirtColor: '#ff0000',
            pantColor: '#00ff00',
            shoesColor: '#ffffff',
            arm_length: 1,
            arm_width: 1,
            leg_length: 1,
            leg_width: 1,
        },
    })
    return (
        <div className='flex w-[600px] h-full'>
            <div className='w-1/2 min-h-[550px] flex justify-center items-center'>
                <Canvas shadows className='flex justify-center items-center' camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }} >
                    <Environment preset='forest' />
                    <pointLight position={[10, 10, 100]} />
                    <ambientLight intensity={5} />
                    <AvatarDisplay form={form} />
                </Canvas>
            </div>
            <div className='w-1/2'>
                <Configuration form={form} next={next} />
            </div>
        </div>
    )
}
import React, { useEffect, useState } from 'react'
import Configuration from './AvatarConfigurator'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import AvatarDisplay from './AvatarDisplay'
import { Environment } from '@react-three/drei'
import { Canvas } from 'react-three-fiber'

const formSchema = z.object({
    hairColor: z.string(),
    shirtColor: z.string(),
    pantColor: z.string(),
    shoesColor: z.string(),
    arm_length: z.number(),
    arm_width: z.number(),
    leg_length: z.number(),
    leg_width: z.number(),
    shoesColor: z.string(),
    gender: z.string()
})

export default function AvatarConfigurator({ next }) {
    const [modelPath, setModelPath] = useState('/models/Avatar.glb');
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
            gender: 'male'
        },
    })

    console.log(form.watch('arm_length'), form.watch('leg_length'), form.watch('arm_width'), form.watch('leg_width'))

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.gender === 'male') {
                setModelPath('/models/Avatar.glb');
            } else {
                setModelPath('/models/Female.glb');
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);


    return (
        <div className='flex w-[650px] h-full'>
            <div className='w-1/2 min-h-[550px] flex justify-center items-center'>
                <Canvas shadows className='flex justify-center items-center' camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }} >
                    <Environment preset='forest' />
                    <pointLight position={[10, 10, 100]} />
                    <ambientLight intensity={5} />
                    <AvatarDisplay form={form} modelPath={modelPath} />
                </Canvas>
            </div>
            <div className='w-1/2'>
                <Configuration form={form} next={next} />
            </div>
        </div>
    )
}
import React from 'react'
import { Button } from './ui/button'
import { Form } from '@/modules/Forms'

export default function Navbar() {
    return (
        <div className='w-full h-14 border-2 border-black fixed z-[9999] flex justify-between'>
            <div className='w-1/4 border-2 border-red-400 h-full'>
                {/* div for icon */}
            </div>
            <div className='w-1/2 h-full border-2 border-blue-500'>
                <div className='flex justify-around flex-wrap items-center h-full w-1/3'>
                    <Form />
                    <Button variant='secondary' className='hover:bg-violet-200'>Login</Button>
                </div>
            </div>
        </div>
    )
}

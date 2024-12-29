import React, { useEffect } from 'react'
import { Form } from '@/modules/Form'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { toast } from 'sonner';
import { resetUser } from '@/redux/slices/userSlice';
import { SwitchCamera } from 'lucide-react';
import { userInitialState } from '@/redux/intialStates/userInitialState';
import RoomList from './RoomList';

export default function Navbar({ setIsOpen, setIsFirstPerson, isOpen }) {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    console.log(user)
    const signOutUser = async () => {
        try {
            if (user?.roomId) {
                
            }

            dispatch(resetUser(userInitialState))
            toast.success('Logged out successfully')
        } catch (error) {
            console.log(error);
            console.error('Error signing out:', error.message);
            toast.error('Error signing out');
        }
    };


    return (
        <div className='w-full h-14 fixed z-[10] flex justify-between backdrop-blur-3xl'>
            <div className='w-1/4 border-2 h-full flex justify-center items-center'>
                <p className='text-center text-[20px] font-semibold'>
                    Meta Bazaar
                </p>
            </div>
            <div className='w-1/2 h-full flex items-center'>
                <div className='flex justify-around flex-nowrap items-center h-full w-1/3'>
                    {
                        user?.authenticated && !isOpen ?
                            (
                                <Button variant='secondary' onClick={signOutUser}>Logout</Button>
                            )
                            :
                            (
                                <Form setIsOpen={setIsOpen} isOpen={isOpen} />
                            )
                    }
                </div>
                <div className='flex w-full h-full'>
                    <div className='w-1/3 h-full flex justify-center items-center'>
                        <Button onClick={() => { setIsFirstPerson((prev) => !prev) }}>
                            <SwitchCamera />
                        </Button>
                    </div>
                    <div className='w-1/3 bg-gray-300 h-full flex justify-center items-center'>
                        <RoomList roomId={user?.roomId} />
                    </div>
                    <div className='w-1/3 bg-gray-300 h-full flex justify-center items-center'>
                        {user?.name}
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import AvatarConfigurator from "../Avatar/configurator"
import Signup from "./Signup"
import Login from "./Login"
import RoomList from "@/components/RoomList"


export function Form({ isOpen, setIsOpen }) {
    const [step, setStep] = useState(0)
    const [isSignUp, setIsSignUp] = useState(true)

    return (
        <AlertDialog setIsOpen={setIsOpen} open={isOpen}>
            <AlertDialogTrigger asChild>
                <div>
                    <Button className='bg-purple-600 hover:bg-purple-800 text-white' onClick={() => { setIsSignUp(true); setIsOpen(true) }}>Signup</Button>
                    <Button variant='secondary' className='hover:bg-violet-200' onClick={() => { setIsSignUp(false); setIsOpen(true) }}>Login</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className='flex flex-col flex-wrap min-w-fit'>
                {
                    isSignUp ? (
                        <>
                            {
                                step === 0 && <Signup next={setStep} setIsOpen={setIsOpen} />
                            }
                            {
                                step === 1 && <AvatarConfigurator next={setStep} />
                            }
                            {
                                step === 2 && <RoomList setIsOpen={setIsOpen} />
                            }
                        </>
                    )
                        :
                        (
                            <>
                                {
                                    step == 0 && <Login next={setStep} setIsOpen={setIsOpen} />
                                }
                                {
                                    step == 1 && <RoomList setIsOpen={setIsOpen} />
                                }
                            </>
                        )
                }   
            </AlertDialogContent>
        </AlertDialog>
    )
}

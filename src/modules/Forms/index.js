'use client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Signup from "./Signup"
import { useState } from "react"
import AvatarConfigurator from "../Avatar/configurator"





export function Form({ setIsOpen }) {
    const [step, setStep] = useState(0)

    return (
        <AlertDialog onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button className='bg-purple-600 hover:bg-purple-800'>Signup</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='flex flex-col flex-wrap w-full'>
                {
                    step === 0 && <Signup next={setStep} />
                }
                {
                    step === 1 && <AvatarConfigurator />
                }
                {
                    step === 2 && <div>Signup Successful</div>
                }
            </AlertDialogContent>
        </AlertDialog>
    )
}

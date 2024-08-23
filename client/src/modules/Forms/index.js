'use client'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Signup from "./Signup"
import { useState } from "react"





export function Form() {
    const [step, setStep] = useState(0)

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='bg-purple-600 hover:bg-purple-800'>Signup</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='flex flex-col flex-wrap w-full'>
                <Signup />
            </AlertDialogContent>
        </AlertDialog>
    )
}

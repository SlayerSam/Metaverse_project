import { AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ColorField, SlideField } from '@/components/formComponents'
import React from 'react'

export default function Configuration({ form }) {
    async function onSubmit(data) {

    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Configure your Avatar
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-wrap flex-col">
                            <div className="flex flex-col w-full">
                                <ColorField
                                    form={form}
                                    name={'hairColor'}
                                    label={'Avatar Hair color'}
                                />
                                <ColorField
                                    form={form}
                                    name={'shirtColor'}
                                    label={'Avatar Shirt color'}
                                />
                                <ColorField
                                    form={form}
                                    name={'pantColor'}
                                    label={'Avatar Pant color'}
                                />
                                <ColorField
                                    form={form}
                                    name={'shoesColor'}
                                    label={'Avatar Shoes color'}
                                />
                                <SlideField
                                    form={form}
                                    name={'left_arm'}
                                    label={'Select arm size'}
                                    placeholder={'Left Arm'}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit'>Continue</Button>
                </AlertDialogFooter>
            </form>
        </Form>
    )
}

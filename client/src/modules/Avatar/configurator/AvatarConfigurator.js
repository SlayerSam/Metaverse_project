import { AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ColorField, SlideField } from '@/components/formComponents'
import React from 'react'
import { avatarStore } from '@/components/WebSocketClient'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/slices/userSlice'

export default function Configuration({ form, next }) {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const onSubmit = async (formData, e) => {
        e.preventDefault();
        console.log(user)
        formData.userId = user.id
        await avatarStore(formData).then((avatarId) => {
            console.log('Avatar configuration saved');
            let obj = { ...user }
            delete formData.userId
            obj.avatar = avatarId
            dispatch(setUser(obj))
            form.reset();
            next((prev) => prev + 1)
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Configure your Avatar
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-wrap flex-col w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-y-3">
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
                                    name={'arm_length'}
                                    label={'Select arm length'}
                                    placeholder={'Arm Length'}
                                />
                                <SlideField
                                    form={form}
                                    name={'arm_width'}
                                    label={'Select arm width'}
                                    placeholder={'Arm Width'}
                                />
                                <SlideField
                                    form={form}
                                    name={'leg_length'}
                                    label={'Select leg length'}
                                    placeholder={'Leg Length'}
                                />
                                <SlideField
                                    form={form}
                                    name={'leg_width'}
                                    label={'Select leg width'}
                                    placeholder={'Leg Width'}
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

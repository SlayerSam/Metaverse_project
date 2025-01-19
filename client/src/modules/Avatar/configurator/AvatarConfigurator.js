import { AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ColorField, SlideField } from '@/components/formComponents'
import React from 'react'
import { avatarStore } from '@/components/WebSocketClient'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/slices/userSlice'
import { toast } from 'sonner'

export default function Configuration({ form, next }) {
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const onSubmit = async (formData, e) => {
        e.preventDefault();
        try {
            formData.userId = user.id
            await avatarStore(formData).then((avatarId) => {
                let obj = { ...user }
                delete formData.userId
                obj.avatar = avatarId
                dispatch(setUser(obj))
                form.reset();
                next((prev) => prev + 1)
            })
        }
        catch (e) {
            console.error('Error in avatar configuration', e)
            toast.error('Error in avatar configuration')
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="mt-10 scroll-m-20 border-b pb-3 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Configure your Avatar
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-wrap flex-col w-full">
                            <div className='flex gap-4 w-full h-fit p-1 border-b-2 pb-3 mb-2 justify-evenly'>
                                <div className={`border-2 p-2 ${form.watch('gender') == 'male' && "border-blue-500"} fill-black dark:fill-gray-600 rounded-md cursor-pointer`} onClick={() => form.setValue('gender', 'male')}>
                                    <svg fill={form.watch('gender') == 'male' ? 'royalBlue' : 'inherit'} width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.5,7H15a1,1,0,0,1,.949.684l2,6a1,1,0,0,1-1.9.632L14.5,9.662V22a1,1,0,0,1-2,0V16h-1v6a1,1,0,0,1-2,0V9.662L7.949,14.316a1,1,0,0,1-1.9-.632l2-6A1,1,0,0,1,9,7Zm0-3.5A2.5,2.5,0,1,0,12,1,2.5,2.5,0,0,0,9.5,3.5Z" /></svg>
                                </div>
                                <div className={`border-2 p-2 ${form.watch('gender') == 'female' && 'border-fuchsia-500 '} fill-black dark:fill-gray-600 cursor-pointer rounded-md`} onClick={() => form.setValue('gender', 'female')}>
                                    <svg fill={form.watch('gender') == 'female' ? 'fuchsia' : 'inherit'} width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.5,3.5V6h-5V3.5a2.5,2.5,0,0,1,5,0Zm0,18.5V16H16l-1.659-5.974,2.878,3.6a1,1,0,0,0,1.562-1.25l-4-5A1,1,0,0,0,14,7H10a1,1,0,0,0-.781.375l-4,5a1,1,0,0,0,1.562,1.25l2.878-3.6L8,16H9.5v6a1,1,0,0,0,2,0V16h1v6a1,1,0,0,0,2,0Z" /></svg>
                                </div>
                            </div>
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
                                    max={1.5}
                                    step={0.1}
                                    min={0.3}
                                />
                                <SlideField
                                    form={form}
                                    name={'arm_width'}
                                    label={'Select arm width'}
                                    placeholder={'Arm Width'}
                                    max={1.5}
                                    step={0.1}
                                    min={0.3}
                                />
                                <SlideField
                                    form={form}
                                    name={'leg_length'}
                                    label={'Select leg length'}
                                    placeholder={'Leg Length'}
                                    max={1.2}
                                    step={0.1}
                                    min={0.8}
                                />
                                <SlideField
                                    form={form}
                                    name={'leg_width'}
                                    label={'Select leg width'}
                                    placeholder={'Leg Width'}
                                    max={1.5}
                                    step={0.1}
                                    min={0.5}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='flex w-full justify-around'>
                        <AlertDialogCancel variant='outline' onClick={() => {
                            const currentValues = form.getValues();
                            const { gender, ...otherValues } = currentValues;
                            form.reset({ gender });
                        }}>Reset</AlertDialogCancel>
                        <Button type='submit'>Continue</Button>
                    </div>
                </AlertDialogFooter>
            </form>
        </Form >
    )
}

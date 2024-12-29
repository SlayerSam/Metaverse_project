import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { PasswordField, ReusableField } from "@/components/formComponents";
import { Button } from "@/components/ui/button";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createRoom, getSocket, login } from "@/components/WebSocketClient";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters.",
        })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        }),
});

export default function Login({ next, setIsOpen }) {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const onSubmit = async (formData) => {
        try {
            if (!isLoading) {
                setIsLoading(true)
                const { response, err } = await login({
                    email: formData.email,
                    password: formData.password,
                });
                if (err) {
                    toast.error(err?.reason || err)
                    return;
                }
                const { loginData } = response
                const obj = {}
                if (loginData) {
                    obj.email = loginData.email;
                    obj.name = loginData.displayName;
                    obj.createdAt = loginData.createdAt;
                    obj.lastLoginAt = loginData.lastLogin;
                    obj.authenticated = true;
                    obj.avatar = loginData.avatar;
                    obj.id = loginData.id;
                    dispatch(setUser(obj));
                    try {
                        await createRoom().then(() => {
                            toast.success('User Logged in successfully');
                            next((prev) => prev + 1)
                            setIsLoading(false)
                        })
                    } catch (error) {
                        console.error('room creation', error);
                    }
                } else {
                    toast.error(loginData?.error || 'Error during login');
                    setIsLoading(false)
                }
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AlertDialogHeader>
                    <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Welcome Back
                    </h2>
                    <AlertDialogDescription>
                        <div className="flex flex-wrap flex-col pt-4 gap-4">
                            <ReusableField
                                form={form}
                                name={'email'}
                                label={'Enter your email'}
                                placeholder={'Email Address'}
                                component={Input}
                            />
                            <PasswordField
                                form={form}
                                name={'password'}
                                label={'Enter your password'}
                                placeholder={'Password'}
                                component={Input}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel>
                    <Button type='submit'>Continue</Button>
                </AlertDialogFooter>
            </form>
        </Form>
    );
}

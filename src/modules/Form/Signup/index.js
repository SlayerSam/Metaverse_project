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
import { AlertTitle } from "@mui/material";

const formSchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name cannot be empty.",
    }),
    lastName: z.string().min(2, {
        message: "Last Name cannot be empty.",
    }),
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

export default function Signup({ next }) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        },
    });

    const onSubmit = async (formData) => {
        try {
            const response = await fetch('/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.firstName + ' ' + formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    isSignUp: true
                }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('User signed up successfully');
                next((prev) => prev + 1);
            } else {
                toast.error(data.error || 'Error during signup');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AlertDialogHeader>
                    <AlertTitle className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Join Us
                    </AlertTitle>
                    <AlertDialogDescription>
                        <div className="flex flex-wrap flex-col pt-4 gap-4">
                            <div className="grid col-span-2 md:grid-flow-col gap-4 grid-flow-row">
                                <ReusableField
                                    form={form}
                                    name={'firstName'}
                                    label={'Enter your first Name'}
                                    placeholder={'First Name'}
                                    component={Input}
                                />
                                <ReusableField
                                    form={form}
                                    name={'lastName'}
                                    label={'Enter your last Name'}
                                    placeholder={'Last Name'}
                                    component={Input}
                                />
                            </div>
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit'>Continue</Button>
                </AlertDialogFooter>
            </form>
        </Form>
    );
}

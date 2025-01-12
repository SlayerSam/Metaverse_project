import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

const {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} = require("@/components/ui/form");

export function ReusableField({
    form,
    name,
    label,
    placeholder,
    component: Component,
    icon: Icon,
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl style={{ display: 'flex', alignItems: 'center' }}>
                        <Component placeholder={placeholder} {...field} style={{ flex: 1 }} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function PasswordField({
    form,
    name,
    label,
    placeholder,
}) {
    const [isShow, setIsShow] = useState(false)
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl style={{ display: 'flex', alignItems: 'center' }}>
                        <Input type='password' placeholder={placeholder} {...field} style={{ flex: 1 }} className='pr-10' isShow={isShow} setIsShow={setIsShow} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function ColorField({
    form,
    name,
    label,
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="block text-sm font-medium mb-2">{label}</FormLabel>
                    <FormControl className='flex justify-center items-center w-full'>
                        <Input type="color" {...field} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none" id="hs-color-input" title="Choose your color" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export function SlideField({
    form,
    name,
    label,
    placeholder,
    max,
    step,
    min,
    className
}) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="block text-sm font-medium my-2 dark:text-white">{label}</FormLabel>
                    <FormControl className='flex justify-center items-center w-full'>
                        <Slider
                            min={min}
                            max={max}
                            step={step}
                            className={cn("w-[85%] mt-2 py-2", className)}
                            placeholder={placeholder}
                            value={[field.value]}
                            onValueChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
import { Input } from "@/components/ui/input";
import { Eye, EyeIcon, EyeOff, EyeOffIcon } from "lucide-react";
import { useState } from "react";

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
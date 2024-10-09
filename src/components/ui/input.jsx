import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react";

const Input = React.forwardRef(({ className, type, isShow, setIsShow, ...props }, ref) => {
  return (
    (
      <div className="relative">
        <input
          type={isShow ? 'text' : type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          isShow != undefined &&
          <div onClick={() => setIsShow(!isShow)} className={cn('absolute right-2 top-2 hover:cursor-pointer')}>
            {
              isShow ?
                <EyeOff />
                :
                <Eye />
            }
          </div>
        }
      </div>
    )
  );
})
Input.displayName = "Input"

export { Input }

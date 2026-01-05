import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg border",
  {
    variants: {
      variant: {
        default: "btn-gradient text-white hover:opacity-90 border-[#2E46BC]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 border-destructive",
        outline:
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 text-gray-700",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
        ghost:
          "hover:bg-accent hover:text-accent-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-11 px-4 py-2.5 gap-2 has-[>svg]:px-3",
        sm: "h-8 px-3 py-2 gap-2 has-[>svg]:px-2.5",
        lg: "h-10 px-6 py-2.5 gap-2 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

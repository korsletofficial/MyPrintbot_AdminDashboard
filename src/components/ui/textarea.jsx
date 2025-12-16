import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border-0 bg-[#F5F5F7] px-4 py-3 text-sm text-gray-700 shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 focus-visible:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

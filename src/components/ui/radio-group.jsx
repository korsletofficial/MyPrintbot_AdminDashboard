import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext({
  value: undefined,
  onValueChange: () => {},
  name: undefined,
})

const RadioGroup = React.forwardRef(({ className, value, onValueChange, name, children, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: onValueChange || (()=>{}), name }}>
      <div role="radiogroup" ref={ref} className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, value, id, disabled, ...props }, ref) => {
  const ctx = React.useContext(RadioGroupContext)
  const checked = ctx.value === value

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={() => !disabled && ctx.onValueChange && ctx.onValueChange(value)}
      id={id}
      ref={ref}
      className={cn(
        "aspect-square h-5 w-5 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked
          ? "border-[#1e3a8a] bg-[#1e3a8a]"
          : "border-gray-300 bg-white hover:border-gray-400",
        className
      )}
      {...props}
    >
      {checked && (
        <span className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-white text-white" />
        </span>
      )}
    </button>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

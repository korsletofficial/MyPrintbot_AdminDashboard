import * as React from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({ open: false, setOpen: () => {} })

const Dialog = ({ open, onOpenChange, children }) => {
  const setOpen = onOpenChange || (() => {})
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ asChild, children }) => {
  const { setOpen } = React.useContext(DialogContext)
  const child = React.Children.only(children)
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, { onClick: () => setOpen(true) })
  }
  return <button onClick={() => setOpen(true)}>{children}</button>
}

const DialogPortal = ({ children }) => {
  if (typeof document === 'undefined') return null
  return createPortal(children, document.body)
}

const DialogClose = ({ children, className }) => {
  const { setOpen } = React.useContext(DialogContext)
  return (
    <button onClick={() => setOpen(false)} className={className}>
      {children || <X className="h-4 w-4" />}
    </button>
  )
}

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/50", className)}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DialogContext)
  if (!open) return null
  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) setOpen(false)
  }
  return (
    <DialogPortal>
      <DialogOverlay onClick={onBackdrop} />
      <div
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-white p-6 shadow-lg",
          className
        )}
        role="dialog"
        {...props}
      >
        {children}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-500", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-11 min-w-0 max-w-full px-4 py-2.5 leading-snug text-center whitespace-normal text-pretty active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 border border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 border border-transparent",
        outline:
          "border-2 border-border bg-background text-foreground shadow-xs hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/85 border border-transparent",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground border border-transparent",
        link: "text-primary underline-offset-4 hover:underline min-h-0 px-0 py-1 border-transparent shadow-none",
        premium:
          "border border-transparent bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:opacity-95 hover:shadow-emerald-500/20",
      },
      size: {
        default: "min-h-11 px-4 py-2.5 sm:min-h-10 sm:py-2",
        sm: "min-h-10 rounded-lg px-3 py-2 text-xs font-semibold",
        lg: "min-h-12 rounded-xl px-6 py-3 text-base gap-2.5 [&_svg]:size-5",
        icon: "size-11 sm:size-10 min-h-0 p-0 shrink-0 [&_svg]:size-[1.125rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

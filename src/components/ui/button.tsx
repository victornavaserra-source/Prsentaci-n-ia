import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-[160ms] [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'rounded-[6px] bg-cyan-400 text-[#050810] font-semibold hover:bg-cyan-300',
        destructive: 'rounded-[6px] bg-red-500 text-white hover:bg-red-400',
        outline: 'rounded-[6px] border border-white/[0.12] bg-white/[0.03] text-white/75 hover:bg-white/[0.07] hover:text-white',
        secondary: 'rounded-[6px] bg-white/[0.06] text-white/75 hover:bg-white/[0.10]',
        ghost: 'text-white/45 hover:text-white/80 hover:bg-white/[0.04] rounded-[6px]',
        link: 'text-cyan-400 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-6 text-[0.88rem]',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

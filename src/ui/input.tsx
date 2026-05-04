import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-offset-slate-950 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-sky-500',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

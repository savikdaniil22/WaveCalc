import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Badge = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => <span className={cn('rounded-md px-2 py-1 text-xs font-semibold', className)}>{children}</span>

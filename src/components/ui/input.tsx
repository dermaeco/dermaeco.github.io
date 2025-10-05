import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-stone-700">
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'wabi-input focus:outline-none focus:ring-2 focus:ring-wabi-taupe focus:ring-opacity-50',
              icon && 'pl-10',
              error && 'border-wabi-earth focus:ring-wabi-taupe',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-wabi-earth">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-wabi disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-black hover:bg-gray-800 text-white',
      secondary: 'bg-white hover:bg-gray-50 border border-black text-black',
      outline: 'border border-black text-black hover:bg-gray-50 hover:border-gray-800',
      ghost: 'text-gray-600 hover:text-black hover:bg-gray-100',
      link: 'text-gray-600 hover:text-black underline-offset-4 hover:underline'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl'
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <img 
            src="/src/assets/dermaeco-logo.png" 
            alt="Loading" 
            className="w-4 h-4 mr-2 animate-spin"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button, ButtonProps } from './button'

interface AnimatedButtonProps extends Omit<ButtonProps, 'size'> {
  animation?: 'bounce' | 'pulse' | 'shake' | 'glow' | 'ripple' | 'magnetic' | 'flip' | 'wobble'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  gradient?: boolean
  neon?: boolean
  glow?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  animation = 'bounce',
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  gradient = false,
  neon = false,
  glow = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  }

  const animations = {
    bounce: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      animate: { y: [0, -2, 0] },
      transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' }
    },
    pulse: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 1, repeat: Infinity }
    },
    shake: {
      whileHover: { 
        x: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.5 }
      },
      whileTap: { scale: 0.95 }
    },
    glow: {
      whileHover: { 
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)',
        scale: 1.05
      },
      whileTap: { scale: 0.95 }
    },
    ripple: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    magnetic: {
      whileHover: { 
        scale: 1.1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      },
      whileTap: { scale: 0.9 }
    },
    flip: {
      whileHover: { 
        rotateY: 180,
        transition: { duration: 0.6 }
      },
      whileTap: { scale: 0.95 }
    },
    wobble: {
      whileHover: { 
        rotate: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5 }
      },
      whileTap: { scale: 0.95 }
    }
  }

  const currentAnimation = animations[animation]

  const buttonContent = (
    <>
      {loading ? (
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span>{loadingText}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && iconPosition === 'left' && (
            <motion.span
              animate={animation === 'bounce' ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              {icon}
            </motion.span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <motion.span
              animate={animation === 'bounce' ? { y: [0, -2, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              {icon}
            </motion.span>
          )}
        </div>
      )}
    </>
  )

  return (
    <motion.div
      className="relative inline-block"
      {...currentAnimation}
    >
      <Button
        className={cn(
          sizeClasses[size],
          gradient && 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90',
          neon && 'shadow-lg shadow-primary/50 border border-primary/50',
          glow && 'animate-glow',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </Button>
      
      {/* Ripple effect */}
      {animation === 'ripple' && (
        <motion.div
          className="absolute inset-0 rounded-md overflow-hidden pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 1, 
            opacity: [0, 0.3, 0],
            transition: { duration: 0.6 }
          }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </motion.div>
      )}
    </motion.div>
  )
}

// Predefined animated button variants
export const BounceButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'animation'>) => (
  <AnimatedButton animation="bounce" {...props}>
    {children}
  </AnimatedButton>
)

export const PulseButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'animation'>) => (
  <AnimatedButton animation="pulse" {...props}>
    {children}
  </AnimatedButton>
)

export const GlowButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'animation'>) => (
  <AnimatedButton animation="glow" glow {...props}>
    {children}
  </AnimatedButton>
)

export const MagneticButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'animation'>) => (
  <AnimatedButton animation="magnetic" {...props}>
    {children}
  </AnimatedButton>
)

export const GradientButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'gradient'>) => (
  <AnimatedButton gradient {...props}>
    {children}
  </AnimatedButton>
)

export const NeonButton = ({ children, ...props }: Omit<AnimatedButtonProps, 'neon' | 'glow'>) => (
  <AnimatedButton neon glow {...props}>
    {children}
  </AnimatedButton>
)

export default AnimatedButton

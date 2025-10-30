"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HoverEffectsProps {
  children: React.ReactNode
  effect?: 'lift' | 'glow' | 'scale' | 'rotate' | 'tilt' | 'shimmer' | 'gradient' | 'magnetic'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  disabled?: boolean
}

export const HoverEffects: React.FC<HoverEffectsProps> = ({
  children,
  effect = 'lift',
  intensity = 'medium',
  className = '',
  disabled = false
}) => {
  const intensityValues = {
    low: { scale: 1.02, y: -2, glow: 10 },
    medium: { scale: 1.05, y: -4, glow: 20 },
    high: { scale: 1.1, y: -8, glow: 30 }
  }

  const currentIntensity = intensityValues[intensity]

  const effects = {
    lift: {
      whileHover: { 
        y: -currentIntensity.y,
        scale: currentIntensity.scale,
        transition: { duration: 0.3, ease: "easeOut" }
      },
      whileTap: { scale: 0.98 }
    },
    glow: {
      whileHover: { 
        scale: currentIntensity.scale,
        boxShadow: `0 0 ${currentIntensity.glow}px rgba(59, 130, 246, 0.4)`,
        transition: { duration: 0.3 }
      }
    },
    scale: {
      whileHover: { 
        scale: currentIntensity.scale,
        transition: { duration: 0.2 }
      },
      whileTap: { scale: 0.95 }
    },
    rotate: {
      whileHover: { 
        rotate: 5,
        scale: currentIntensity.scale,
        transition: { duration: 0.3 }
      }
    },
    tilt: {
      whileHover: { 
        rotateX: 10,
        rotateY: 10,
        scale: currentIntensity.scale,
        transition: { duration: 0.3 }
      }
    },
    shimmer: {
      whileHover: { 
        backgroundPosition: "200% 0",
        transition: { duration: 0.6 }
      }
    },
    gradient: {
      whileHover: { 
        background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)",
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 50%",
        transition: { duration: 0.3 }
      }
    },
    magnetic: {
      whileHover: { 
        scale: currentIntensity.scale,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }
    }
  }

  if (disabled) {
    return <div className={className}>{children}</div>
  }

  const effectProps = effects[effect] || effects.lift

  return (
    <motion.div
      className={cn(
        "transition-all duration-300",
        effect === 'shimmer' && "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]",
        effect === 'gradient' && "bg-gradient-to-r from-primary to-secondary",
        className
      )}
      {...effectProps}
    >
      {children}
    </motion.div>
  )
}

// Predefined hover effect components
export const HoverLift = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="lift" {...props}>
    {children}
  </HoverEffects>
)

export const HoverGlow = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="glow" {...props}>
    {children}
  </HoverEffects>
)

export const HoverScale = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="scale" {...props}>
    {children}
  </HoverEffects>
)

export const HoverRotate = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="rotate" {...props}>
    {children}
  </HoverEffects>
)

export const HoverTilt = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="tilt" {...props}>
    {children}
  </HoverEffects>
)

export const HoverShimmer = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="shimmer" {...props}>
    {children}
  </HoverEffects>
)

export const HoverGradient = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="gradient" {...props}>
    {children}
  </HoverEffects>
)

export const HoverMagnetic = ({ children, ...props }: Omit<HoverEffectsProps, 'effect'>) => (
  <HoverEffects effect="magnetic" {...props}>
    {children}
  </HoverEffects>
)

export default HoverEffects

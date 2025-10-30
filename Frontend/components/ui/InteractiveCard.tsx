"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'gradient' | 'neon' | 'magnetic'
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  glow?: boolean
  tilt?: boolean
  onClick?: () => void
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  interactive = true,
  glow = false,
  tilt = false,
  onClick
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const variants = {
    default: 'bg-card border border-border shadow-sm hover:shadow-md',
    glass: 'glass border border-white/10 shadow-lg',
    gradient: 'bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20',
    neon: 'bg-card border border-primary/50 shadow-lg shadow-primary/20',
    magnetic: 'bg-card border border-border shadow-sm'
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !interactive) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !interactive) return
    
    const card = e.currentTarget
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <motion.div
      className={cn(
        'rounded-lg transition-all duration-300 cursor-pointer',
        sizeClasses[size],
        variants[variant],
        glow && 'animate-glow',
        interactive && 'hover:scale-105 active:scale-95',
        className
      )}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={interactive ? { 
        y: -4,
        boxShadow: glow ? '0 20px 40px rgba(59, 130, 246, 0.3)' : undefined
      } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Predefined card variants
export const GlassCard = ({ children, ...props }: Omit<InteractiveCardProps, 'variant'>) => (
  <InteractiveCard variant="glass" {...props}>
    {children}
  </InteractiveCard>
)

export const GradientCard = ({ children, ...props }: Omit<InteractiveCardProps, 'variant'>) => (
  <InteractiveCard variant="gradient" {...props}>
    {children}
  </InteractiveCard>
)

export const NeonCard = ({ children, ...props }: Omit<InteractiveCardProps, 'variant'>) => (
  <InteractiveCard variant="neon" glow {...props}>
    {children}
  </InteractiveCard>
)

export const MagneticCard = ({ children, ...props }: Omit<InteractiveCardProps, 'variant'>) => (
  <InteractiveCard variant="magnetic" tilt {...props}>
    {children}
  </InteractiveCard>
)

export default InteractiveCard

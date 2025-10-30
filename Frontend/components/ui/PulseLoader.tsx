"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
  variant?: 'single' | 'double' | 'triple' | 'ripple'
  animated?: boolean
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
  variant = 'single',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const renderSingle = () => (
    <motion.div
      className="w-full h-full rounded-full"
      style={{ backgroundColor: color }}
      animate={animated ? {
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      } : {}}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )

  const renderDouble = () => (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={animated ? {
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-1 rounded-full"
        style={{ backgroundColor: color }}
        animate={animated ? {
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
    </div>
  )

  const renderTriple = () => (
    <div className="relative w-full h-full">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={animated ? {
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.6, 0.2]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  )

  const renderRipple = () => (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: color }}
        animate={animated ? {
          scale: [1, 2, 1],
          opacity: [1, 0, 1]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={animated ? {
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'double':
        return renderDouble()
      case 'triple':
        return renderTriple()
      case 'ripple':
        return renderRipple()
      default:
        return renderSingle()
    }
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      {renderLoader()}
    </div>
  )
}

export default PulseLoader

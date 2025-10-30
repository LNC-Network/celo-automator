"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressLoaderProps {
  progress?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'circular' | 'linear' | 'step'
  color?: string
  className?: string
  showPercentage?: boolean
  animated?: boolean
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress = 0,
  size = 'md',
  variant = 'circular',
  color = 'currentColor',
  className = '',
  showPercentage = true,
  animated = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const strokeWidth = {
    sm: 2,
    md: 3,
    lg: 4
  }

  const radius = {
    sm: 12,
    md: 24,
    lg: 36
  }

  const circumference = 2 * Math.PI * radius[size]

  const renderCircular = () => (
    <div className="relative">
      <svg
        className={cn("transform -rotate-90", sizeClasses[size])}
        viewBox={`0 0 ${radius[size] * 2 + strokeWidth[size] * 2} ${radius[size] * 2 + strokeWidth[size] * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          fill="none"
          className="opacity-20"
        />
        {/* Progress circle */}
        <motion.circle
          cx={radius[size] + strokeWidth[size]}
          cy={radius[size] + strokeWidth[size]}
          r={radius[size]}
          stroke={color}
          strokeWidth={strokeWidth[size]}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: circumference - (progress / 100) * circumference 
          }}
          transition={{ duration: animated ? 0.8 : 0, ease: "easeInOut" }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn("font-semibold", textSizeClasses[size])}
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
    </div>
  )

  const renderLinear = () => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          Progress
        </span>
        {showPercentage && (
          <motion.span
            className={cn("font-semibold", textSizeClasses[size])}
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.round(progress)}%
          </motion.span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-2 rounded-full transition-all duration-300"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: "easeInOut" }}
        />
      </div>
    </div>
  )

  const renderStep = () => (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          Step {Math.ceil(progress / 20)} of 5
        </span>
        {showPercentage && (
          <span className={cn("font-semibold", textSizeClasses[size])} style={{ color }}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        {[0, 1, 2, 3, 4].map((step) => {
          const stepProgress = Math.max(0, Math.min(100, (progress - step * 20) * 5))
          const isCompleted = progress > (step + 1) * 20
          const isActive = progress > step * 20 && !isCompleted

          return (
            <div key={step} className="flex-1">
              <div className="relative">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isCompleted ? '100%' : isActive ? `${stepProgress}%` : '0%' 
                    }}
                    transition={{ duration: animated ? 0.5 : 0, ease: "easeInOut" }}
                  />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: isCompleted ? color : 'transparent' }}
                  animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {variant === 'circular' && renderCircular()}
      {variant === 'linear' && renderLinear()}
      {variant === 'step' && renderStep()}
    </div>
  )
}

export default ProgressLoader

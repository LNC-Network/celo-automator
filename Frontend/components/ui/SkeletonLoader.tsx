"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'card' | 'list' | 'table'
  width?: string | number
  height?: string | number
  className?: string
  lines?: number
  animated?: boolean
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
  lines = 1,
  animated = true
}) => {
  const shimmerVariants = {
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  const renderSkeleton = () => {
    switch (variant) {
      case 'circular':
        return (
          <motion.div
            className={cn(
              "rounded-full bg-muted",
              className
            )}
            style={{ width, height }}
            variants={animated ? shimmerVariants : undefined}
            animate={animated ? "shimmer" : undefined}
          />
        )

      case 'rectangular':
        return (
          <motion.div
            className={cn(
              "rounded-md bg-muted",
              className
            )}
            style={{ width, height }}
            variants={animated ? shimmerVariants : undefined}
            animate={animated ? "shimmer" : undefined}
          />
        )

      case 'card':
        return (
          <div className={cn("space-y-3", className)}>
            <motion.div
              className="h-4 bg-muted rounded"
              style={{ width: '60%' }}
              variants={animated ? shimmerVariants : undefined}
              animate={animated ? "shimmer" : undefined}
            />
            <motion.div
              className="h-3 bg-muted rounded"
              style={{ width: '100%' }}
              variants={animated ? shimmerVariants : undefined}
              animate={animated ? "shimmer" : undefined}
            />
            <motion.div
              className="h-3 bg-muted rounded"
              style={{ width: '80%' }}
              variants={animated ? shimmerVariants : undefined}
              animate={animated ? "shimmer" : undefined}
            />
          </div>
        )

      case 'list':
        return (
          <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted rounded"
                style={{ width: i === lines - 1 ? '60%' : '100%' }}
                variants={animated ? shimmerVariants : undefined}
                animate={animated ? "shimmer" : undefined}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        )

      case 'table':
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex space-x-3">
                <motion.div
                  className="h-4 bg-muted rounded flex-1"
                  variants={animated ? shimmerVariants : undefined}
                  animate={animated ? "shimmer" : undefined}
                  transition={{ delay: i * 0.1 }}
                />
                <motion.div
                  className="h-4 bg-muted rounded w-20"
                  variants={animated ? shimmerVariants : undefined}
                  animate={animated ? "shimmer" : undefined}
                  transition={{ delay: i * 0.1 + 0.1 }}
                />
                <motion.div
                  className="h-4 bg-muted rounded w-16"
                  variants={animated ? shimmerVariants : undefined}
                  animate={animated ? "shimmer" : undefined}
                  transition={{ delay: i * 0.1 + 0.2 }}
                />
              </div>
            ))}
          </div>
        )

      default: // text
        return (
          <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted rounded"
                style={{ 
                  width: i === lines - 1 ? '60%' : '100%',
                  height 
                }}
                variants={animated ? shimmerVariants : undefined}
                animate={animated ? "shimmer" : undefined}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        )
    }
  }

  return renderSkeleton()
}

// Predefined skeleton components for common use cases
export const SkeletonCard = () => (
  <div className="p-6 border rounded-lg space-y-4">
    <SkeletonLoader variant="rectangular" height="2rem" width="60%" />
    <SkeletonLoader variant="text" lines={3} />
    <div className="flex justify-between items-center">
      <SkeletonLoader variant="rectangular" height="2rem" width="6rem" />
      <SkeletonLoader variant="circular" height="2rem" width="2rem" />
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    <div className="flex space-x-3">
      <SkeletonLoader variant="rectangular" height="1rem" width="25%" />
      <SkeletonLoader variant="rectangular" height="1rem" width="25%" />
      <SkeletonLoader variant="rectangular" height="1rem" width="25%" />
      <SkeletonLoader variant="rectangular" height="1rem" width="25%" />
    </div>
    <SkeletonLoader variant="table" lines={rows} />
  </div>
)

export const SkeletonList = ({ items = 4 }: { items?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
        <SkeletonLoader variant="circular" height="2.5rem" width="2.5rem" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="rectangular" height="1rem" width="40%" />
          <SkeletonLoader variant="rectangular" height="0.75rem" width="60%" />
        </div>
        <SkeletonLoader variant="rectangular" height="2rem" width="4rem" />
      </div>
    ))}
  </div>
)

export default SkeletonLoader

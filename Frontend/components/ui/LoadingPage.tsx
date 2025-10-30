"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { AnimatedLoader } from './AnimatedLoader'
import { LoadingSpinner } from './LoadingSpinner'
import { ProgressLoader } from './ProgressLoader'
import { SkeletonLoader, SkeletonCard, SkeletonTable, SkeletonList } from './SkeletonLoader'
import { RevealText } from './RevealText'
import { cn } from '@/lib/utils'

interface LoadingPageProps {
  type?: 'blockchain' | 'transaction' | 'wallet' | 'network' | 'defi'
  message?: string
  progress?: number
  variant?: 'fullscreen' | 'inline' | 'card'
  className?: string
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  type = 'blockchain',
  message = 'Loading...',
  progress,
  variant = 'fullscreen',
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const renderContent = () => (
    <motion.div
      className="flex flex-col items-center justify-center space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <AnimatedLoader
          type={type}
          size="xl"
          text={message}
        />
      </motion.div>
      
      {progress !== undefined && (
        <motion.div variants={itemVariants} className="w-full max-w-md">
          <ProgressLoader
            progress={progress}
            variant="linear"
            size="md"
            showPercentage
            animated
          />
        </motion.div>
      )}
      
      <motion.div variants={itemVariants} className="text-center">
        <RevealText
          text={message}
          animation="fade"
          className="text-lg text-muted-foreground"
          delay={0.5}
        />
      </motion.div>
    </motion.div>
  )

  if (variant === 'fullscreen') {
    return (
      <div className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center",
        className
      )}>
        {renderContent()}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn(
        "p-8 bg-card border rounded-lg shadow-lg",
        className
      )}>
        {renderContent()}
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)}>
      {renderContent()}
    </div>
  )
}

// Predefined loading page variants
export const BlockchainLoading = ({ message, ...props }: Omit<LoadingPageProps, 'type'>) => (
  <LoadingPage type="blockchain" message={message || "Connecting to blockchain..."} {...props} />
)

export const TransactionLoading = ({ message, ...props }: Omit<LoadingPageProps, 'type'>) => (
  <LoadingPage type="transaction" message={message || "Processing transaction..."} {...props} />
)

export const WalletLoading = ({ message, ...props }: Omit<LoadingPageProps, 'type'>) => (
  <LoadingPage type="wallet" message={message || "Connecting wallet..."} {...props} />
)

export const NetworkLoading = ({ message, ...props }: Omit<LoadingPageProps, 'type'>) => (
  <LoadingPage type="network" message={message || "Syncing with network..."} {...props} />
)

export const DeFiLoading = ({ message, ...props }: Omit<LoadingPageProps, 'type'>) => (
  <LoadingPage type="defi" message={message || "Loading DeFi protocols..."} {...props} />
)

// Skeleton loading variants
export const SkeletonLoading = ({ 
  variant = 'card',
  className = ''
}: { 
  variant?: 'card' | 'table' | 'list'
  className?: string 
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'table':
        return <SkeletonTable rows={5} />
      case 'list':
        return <SkeletonList items={4} />
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {renderSkeleton()}
    </div>
  )
}

export default LoadingPage

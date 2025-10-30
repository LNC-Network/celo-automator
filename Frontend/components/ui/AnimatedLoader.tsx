"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedLoaderProps {
  type?: 'blockchain' | 'crypto' | 'network' | 'transaction' | 'wallet' | 'defi'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  type = 'blockchain',
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const renderBlockchainLoader = () => (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute inset-1 rounded-full border-2 border-secondary/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderCryptoLoader = () => (
    <div className="relative">
      {/* Bitcoin symbol animation */}
      <motion.div
        className="text-2xl font-bold text-primary"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ₿
      </motion.div>
      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          style={{
            top: `${20 + (i * 10)}%`,
            left: `${20 + (i * 10)}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}
    </div>
  )

  const renderNetworkLoader = () => (
    <div className="relative">
      {/* Network nodes */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i * 72) * (Math.PI / 180)
        const radius = 20
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        )
      })}
      {/* Center node */}
      <motion.div
        className="absolute w-3 h-3 bg-secondary rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      />
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72) * (Math.PI / 180)
          const radius = 20
          const x1 = Math.cos(angle) * radius + 24
          const y1 = Math.sin(angle) * radius + 24
          
          return (
            <motion.line
              key={i}
              x1="24"
              y1="24"
              x2={x1}
              y2={y1}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          )
        })}
      </svg>
    </div>
  )

  const renderTransactionLoader = () => (
    <div className="relative">
      {/* Transaction arrows */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ x: [-10, 10, -10] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex space-x-1">
          <motion.div
            className="w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <motion.div
            className="w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </motion.div>
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  )

  const renderWalletLoader = () => (
    <div className="relative">
      {/* Wallet icon */}
      <motion.div
        className="w-full h-full border-2 border-primary rounded-lg flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 0 0 rgba(59, 130, 246, 0.4)",
            "0 0 0 8px rgba(59, 130, 246, 0.1)",
            "0 0 0 0 rgba(59, 130, 246, 0.4)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <motion.div
          className="w-6 h-4 bg-primary/20 rounded"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
      </motion.div>
      {/* Floating coins */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-accent rounded-full"
          style={{
            top: `${10 + (i * 20)}%`,
            left: `${10 + (i * 20)}%`
          }}
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  )

  const renderDeFiLoader = () => (
    <div className="relative">
      {/* DeFi protocol visualization */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-secondary/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-accent/70"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Center symbol */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-primary font-bold">₳</div>
      </motion.div>
    </div>
  )

  const renderLoader = () => {
    switch (type) {
      case 'crypto':
        return renderCryptoLoader()
      case 'network':
        return renderNetworkLoader()
      case 'transaction':
        return renderTransactionLoader()
      case 'wallet':
        return renderWalletLoader()
      case 'defi':
        return renderDeFiLoader()
      default:
        return renderBlockchainLoader()
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn(sizeClasses[size])}>
        {renderLoader()}
      </div>
      {text && (
        <motion.p
          className={cn("mt-3 text-muted-foreground font-medium", textSizeClasses[size])}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export default AnimatedLoader

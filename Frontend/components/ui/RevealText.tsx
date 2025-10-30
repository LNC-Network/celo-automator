"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  animation?: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'flip' | 'typewriter'
  direction?: 'up' | 'down' | 'left' | 'right'
  once?: boolean
  threshold?: number
  gradient?: boolean
  shimmer?: boolean
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = 0.05,
  animation = 'fade',
  direction = 'up',
  once = true,
  threshold = 0.1,
  gradient = false,
  shimmer = false
}) => {
  const words = text.split(' ')
  const characters = text.split('')

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay }
      }
    }

    switch (animation) {
      case 'slide':
        return {
          hidden: { 
            opacity: 0, 
            y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
            x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0
          },
          visible: { 
            opacity: 1, 
            y: 0,
            x: 0,
            transition: { duration, delay }
          }
        }
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.5 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration, delay }
          }
        }
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -180 },
          visible: { 
            opacity: 1, 
            rotate: 0,
            transition: { duration, delay }
          }
        }
      case 'bounce':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
              duration, 
              delay,
              type: "spring",
              stiffness: 200,
              damping: 10
            }
          }
        }
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: -90 },
          visible: { 
            opacity: 1, 
            rotateY: 0,
            transition: { duration, delay }
          }
        }
      case 'typewriter':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.1, delay }
          }
        }
      default:
        return baseVariants
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  const itemVariants = getAnimationVariants()

  const renderWords = () => (
    <motion.div
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={itemVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )

  const renderCharacters = () => (
    <motion.div
      className="inline-block"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={itemVariants}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )

  return (
    <div className={cn(
      'overflow-hidden',
      gradient && 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent',
      shimmer && 'animate-text-shimmer',
      className
    )}>
      {animation === 'typewriter' ? renderCharacters() : renderWords()}
    </div>
  )
}

// Predefined reveal text variants
export const FadeText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="fade" {...props} />
)

export const SlideText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="slide" {...props} />
)

export const ScaleText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="scale" {...props} />
)

export const BounceText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="bounce" {...props} />
)

export const FlipText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="flip" {...props} />
)

export const TypewriterText = ({ text, ...props }: Omit<RevealTextProps, 'animation'>) => (
  <RevealText text={text} animation="typewriter" {...props} />
)

export const GradientText = ({ text, ...props }: Omit<RevealTextProps, 'gradient'>) => (
  <RevealText text={text} gradient {...props} />
)

export const ShimmerText = ({ text, ...props }: Omit<RevealTextProps, 'shimmer'>) => (
  <RevealText text={text} shimmer {...props} />
)

export default RevealText

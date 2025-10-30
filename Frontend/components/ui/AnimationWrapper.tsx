"use client"

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimationWrapperProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'bounceIn' | 'flipIn' | 'zoomIn'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  threshold?: number
  stagger?: number
  staggerChildren?: boolean
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  threshold = 0.1,
  stagger = 0.1,
  staggerChildren = false
}) => {
  const animations: Record<string, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration, delay }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay }
      }
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, delay }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, delay }
      }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, delay }
      }
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -180 },
      visible: { 
        opacity: 1, 
        rotate: 0,
        transition: { duration, delay }
      }
    },
    bounceIn: {
      hidden: { opacity: 0, scale: 0.3 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration, 
          delay,
          type: "spring",
          stiffness: 200,
          damping: 10
        }
      }
    },
    flipIn: {
      hidden: { opacity: 0, rotateY: -90 },
      visible: { 
        opacity: 1, 
        rotateY: 0,
        transition: { duration, delay }
      }
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, delay }
      }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren ? stagger : 0,
        delayChildren: delay
      }
    }
  }

  const itemVariants = animations[animation]

  if (staggerChildren) {
    return (
      <motion.div
        className={cn(className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: threshold }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(className)}
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
    >
      {children}
    </motion.div>
  )
}

// Predefined animation components for common use cases
export const FadeIn = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="fadeIn" {...props}>
    {children}
  </AnimationWrapper>
)

export const SlideUp = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="slideUp" {...props}>
    {children}
  </AnimationWrapper>
)

export const SlideDown = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="slideDown" {...props}>
    {children}
  </AnimationWrapper>
)

export const SlideLeft = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="slideLeft" {...props}>
    {children}
  </AnimationWrapper>
)

export const SlideRight = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="slideRight" {...props}>
    {children}
  </AnimationWrapper>
)

export const ScaleIn = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="scaleIn" {...props}>
    {children}
  </AnimationWrapper>
)

export const BounceIn = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="bounceIn" {...props}>
    {children}
  </AnimationWrapper>
)

export const ZoomIn = ({ children, ...props }: Omit<AnimationWrapperProps, 'animation'>) => (
  <AnimationWrapper animation="zoomIn" {...props}>
    {children}
  </AnimationWrapper>
)

export default AnimationWrapper

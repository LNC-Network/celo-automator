"use client"

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxCardProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  scale?: boolean
  rotate?: boolean
  opacity?: boolean
  blur?: boolean
  glow?: boolean
  offset?: number
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  scale = false,
  rotate = false,
  opacity = false,
  blur = false,
  glow = false,
  offset = 0
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getTransform = () => {
    const baseTransform = speed * 100
    const offsetValue = offset * 100

    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [baseTransform + offsetValue, -baseTransform + offsetValue])
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-baseTransform + offsetValue, baseTransform + offsetValue])
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [baseTransform + offsetValue, -baseTransform + offsetValue])
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-baseTransform + offsetValue, baseTransform + offsetValue])
      default:
        return useTransform(scrollYProgress, [0, 1], [0, 0])
    }
  }

  const y = direction === 'up' || direction === 'down' ? getTransform() : 0
  const x = direction === 'left' || direction === 'right' ? getTransform() : 0
  
  const scaleValue = scale ? useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]) : 1
  const rotateValue = rotate ? useTransform(scrollYProgress, [0, 1], [0, 360]) : 0
  const opacityValue = opacity ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) : 1
  const blurValue = blur ? useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, 10]) : 0

  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springX = useSpring(x, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative',
        glow && 'drop-shadow-2xl',
        className
      )}
      style={{
        y: springY,
        x: springX,
        scale: scaleValue,
        rotate: rotateValue,
        opacity: opacityValue,
        filter: blurValue ? `blur(${blurValue}px)` : 'none'
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Predefined parallax variants
export const ParallaxUp = ({ children, ...props }: Omit<ParallaxCardProps, 'direction'>) => (
  <ParallaxCard direction="up" {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxDown = ({ children, ...props }: Omit<ParallaxCardProps, 'direction'>) => (
  <ParallaxCard direction="down" {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxLeft = ({ children, ...props }: Omit<ParallaxCardProps, 'direction'>) => (
  <ParallaxCard direction="left" {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxRight = ({ children, ...props }: Omit<ParallaxCardProps, 'direction'>) => (
  <ParallaxCard direction="right" {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxScale = ({ children, ...props }: Omit<ParallaxCardProps, 'scale'>) => (
  <ParallaxCard scale {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxRotate = ({ children, ...props }: Omit<ParallaxCardProps, 'rotate'>) => (
  <ParallaxCard rotate {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxFade = ({ children, ...props }: Omit<ParallaxCardProps, 'opacity'>) => (
  <ParallaxCard opacity {...props}>
    {children}
  </ParallaxCard>
)

export const ParallaxBlur = ({ children, ...props }: Omit<ParallaxCardProps, 'blur'>) => (
  <ParallaxCard blur {...props}>
    {children}
  </ParallaxCard>
)

export default ParallaxCard

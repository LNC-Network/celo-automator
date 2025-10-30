"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Pause, Play, Zap, Clock, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import type { Automation } from "@/lib/store"
import { InteractiveCard, GlassCard } from "@/components/ui/InteractiveCard"
import { AnimatedButton, GlowButton } from "@/components/ui/AnimatedButton"
import { HoverEffects, HoverLift, HoverGlow } from "@/components/ui/HoverEffects"
import { ProgressLoader } from "@/components/ui/ProgressLoader"
import { AnimationWrapper, FadeIn, SlideUp } from "@/components/ui/AnimationWrapper"

interface AutomationCardProps {
  automation: Automation
  onPause: (id: string) => void
  onResume: (id: string) => void
  onViewDetails: (id: string) => void
  delay?: number
}

export function AutomationCard({ automation, onPause, onResume, onViewDetails, delay = 0 }: AutomationCardProps) {
  const getStatusIcon = () => {
    switch (automation.status) {
      case 'active':
        return <Zap className="w-4 h-4 text-success" />
      case 'paused':
        return <Clock className="w-4 h-4 text-muted-foreground" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-primary" />
      default:
        return <Zap className="w-4 h-4 text-primary" />
    }
  }

  return (
    <AnimationWrapper
      animation="slideUp"
      delay={delay}
      className="h-full"
    >
      <HoverLift intensity="medium">
        <GlassCard
          className="h-full group cursor-pointer"
          glow={automation.status === 'active'}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={automation.status === 'active' ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: automation.status === 'active' ? Infinity : 0 
                }}
              >
                {getStatusIcon()}
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-smooth">
                  {automation.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {automation.type}
                </p>
              </div>
            </div>
            <motion.span
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-smooth flex items-center space-x-1 ${
                automation.status === "active"
                  ? "bg-success/20 text-success"
                  : automation.status === "paused"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/20 text-primary"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span>{automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}</span>
            </motion.span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground font-medium">Progress</span>
              <span className="text-sm font-bold text-foreground">{automation.progress}%</span>
            </div>
            <ProgressLoader
              progress={automation.progress}
              variant="linear"
              size="sm"
              color="hsl(var(--primary))"
              animated
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{automation.nextRun}</p>
            </div>
            <div className="flex gap-2">
              {automation.status === "active" ? (
                <HoverGlow intensity="low">
                  <AnimatedButton
                    size="sm"
                    variant="ghost"
                    onClick={() => onPause(automation.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                    animation="pulse"
                    icon={<Pause size={16} />}
                  />
                </HoverGlow>
              ) : (
                <HoverGlow intensity="low">
                  <AnimatedButton
                    size="sm"
                    variant="ghost"
                    onClick={() => onResume(automation.id)}
                    className="hover:bg-success/10 hover:text-success"
                    animation="bounce"
                    icon={<Play size={16} />}
                  />
                </HoverGlow>
              )}
              <HoverLift intensity="low">
                <AnimatedButton
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(automation.id)}
                  className="group-hover:translate-x-1 transition-smooth"
                  animation="slide"
                  icon={<ArrowRight size={16} />}
                />
              </HoverLift>
            </div>
          </div>
        </GlassCard>
      </HoverLift>
    </AnimationWrapper>
  )
}

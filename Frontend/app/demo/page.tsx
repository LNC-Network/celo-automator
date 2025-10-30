"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProgressLoader } from '@/components/ui/ProgressLoader'
import { SkeletonLoader, SkeletonCard, SkeletonTable, SkeletonList } from '@/components/ui/SkeletonLoader'
import { AnimatedLoader } from '@/components/ui/AnimatedLoader'
import { AnimatedButton, GradientButton, NeonButton, MagneticButton } from '@/components/ui/AnimatedButton'
import { InteractiveCard, GlassCard, GradientCard, NeonCard, MagneticCard } from '@/components/ui/InteractiveCard'
import { RevealText, GradientText, ShimmerText, TypewriterText } from '@/components/ui/RevealText'
import { AnimationWrapper, FadeIn, SlideUp, BounceIn, ScaleIn } from '@/components/ui/AnimationWrapper'
import { HoverEffects, HoverLift, HoverGlow, HoverScale, HoverRotate } from '@/components/ui/HoverEffects'
import { ParallaxCard, ParallaxUp, ParallaxScale, ParallaxFade } from '@/components/ui/ParallaxCard'
import { LoadingPage, BlockchainLoading, TransactionLoading } from '@/components/ui/LoadingPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  Users,
  Activity
} from 'lucide-react'

export default function DemoPage() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  const startProgress = () => {
    setLoading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <AnimationWrapper animation="fadeIn" className="text-center mb-12">
          <RevealText
            text="Enhanced UI Components Demo"
            animation="slide"
            direction="up"
            className="text-4xl font-bold mb-4"
            gradient
          />
          <RevealText
            text="Experience the power of modern animations and interactive elements"
            animation="fade"
            className="text-lg text-muted-foreground"
            delay={0.5}
          />
        </AnimationWrapper>

        <Tabs defaultValue="loaders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="loaders">Loaders</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="text">Text Effects</TabsTrigger>
          </TabsList>

          {/* Loaders Tab */}
          <TabsContent value="loaders" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Loading Components</CardTitle>
                <CardDescription>Various loading states and progress indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Loaders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Loaders</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <LoadingSpinner variant="default" size="lg" />
                      <p className="text-sm text-muted-foreground mt-2">Default</p>
                    </div>
                    <div className="text-center">
                      <LoadingSpinner variant="dots" size="lg" />
                      <p className="text-sm text-muted-foreground mt-2">Dots</p>
                    </div>
                    <div className="text-center">
                      <LoadingSpinner variant="pulse" size="lg" />
                      <p className="text-sm text-muted-foreground mt-2">Pulse</p>
                    </div>
                    <div className="text-center">
                      <LoadingSpinner variant="wave" size="lg" />
                      <p className="text-sm text-muted-foreground mt-2">Wave</p>
                    </div>
                  </div>
                </div>

                {/* Animated Loaders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Animated Loaders</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <AnimatedLoader type="blockchain" size="lg" text="Blockchain" />
                    </div>
                    <div className="text-center">
                      <AnimatedLoader type="transaction" size="lg" text="Transaction" />
                    </div>
                    <div className="text-center">
                      <AnimatedLoader type="wallet" size="lg" text="Wallet" />
                    </div>
                  </div>
                </div>

                {/* Progress Loaders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Progress Loaders</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Circular Progress</p>
                      <ProgressLoader progress={75} variant="circular" size="lg" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Linear Progress</p>
                      <ProgressLoader progress={progress} variant="linear" size="md" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Step Progress</p>
                      <ProgressLoader progress={60} variant="step" size="md" />
                    </div>
                    <Button onClick={startProgress} disabled={loading}>
                      {loading ? 'Loading...' : 'Start Progress'}
                    </Button>
                  </div>
                </div>

                {/* Skeleton Loaders */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skeleton Loaders</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Card Skeleton</p>
                      <SkeletonCard />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Table Skeleton</p>
                      <SkeletonTable rows={3} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">List Skeleton</p>
                      <SkeletonList items={3} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buttons Tab */}
          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Animated Buttons</CardTitle>
                <CardDescription>Interactive buttons with various animations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Animations</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedButton animation="bounce">Bounce</AnimatedButton>
                    <AnimatedButton animation="pulse">Pulse</AnimatedButton>
                    <AnimatedButton animation="shake">Shake</AnimatedButton>
                    <AnimatedButton animation="glow">Glow</AnimatedButton>
                    <AnimatedButton animation="magnetic">Magnetic</AnimatedButton>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Special Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <GradientButton>Gradient</GradientButton>
                    <NeonButton>Neon</NeonButton>
                    <MagneticButton>Magnetic</MagneticButton>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">With Icons</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedButton 
                      animation="bounce" 
                      icon={<Play className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Play
                    </AnimatedButton>
                    <AnimatedButton 
                      animation="pulse" 
                      icon={<Pause className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      Pause
                    </AnimatedButton>
                    <AnimatedButton 
                      animation="glow" 
                      loading={loading}
                      loadingText="Processing..."
                    >
                      {loading ? 'Loading...' : 'Process'}
                    </AnimatedButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Cards</CardTitle>
                <CardDescription>Various card styles with hover effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Card Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InteractiveCard variant="default">
                      <h4 className="font-semibold mb-2">Default Card</h4>
                      <p className="text-sm text-muted-foreground">Standard interactive card</p>
                    </InteractiveCard>
                    <GlassCard>
                      <h4 className="font-semibold mb-2">Glass Card</h4>
                      <p className="text-sm text-muted-foreground">Glass morphism effect</p>
                    </GlassCard>
                    <GradientCard>
                      <h4 className="font-semibold mb-2">Gradient Card</h4>
                      <p className="text-sm text-muted-foreground">Gradient background</p>
                    </GradientCard>
                    <NeonCard>
                      <h4 className="font-semibold mb-2">Neon Card</h4>
                      <p className="text-sm text-muted-foreground">Neon glow effect</p>
                    </NeonCard>
                    <MagneticCard>
                      <h4 className="font-semibold mb-2">Magnetic Card</h4>
                      <p className="text-sm text-muted-foreground">Magnetic hover effect</p>
                    </MagneticCard>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Hover Effects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <HoverLift intensity="high">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Lift Effect</h4>
                        <p className="text-sm text-muted-foreground">Hover to lift</p>
                      </Card>
                    </HoverLift>
                    <HoverGlow intensity="medium">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Glow Effect</h4>
                        <p className="text-sm text-muted-foreground">Hover to glow</p>
                      </Card>
                    </HoverGlow>
                    <HoverScale intensity="high">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Scale Effect</h4>
                        <p className="text-sm text-muted-foreground">Hover to scale</p>
                      </Card>
                    </HoverScale>
                    <HoverRotate intensity="medium">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Rotate Effect</h4>
                        <p className="text-sm text-muted-foreground">Hover to rotate</p>
                      </Card>
                    </HoverRotate>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Text Effects Tab */}
          <TabsContent value="text" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Text Animations</CardTitle>
                <CardDescription>Various text reveal and animation effects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Reveal Animations</h3>
                  <div className="space-y-4">
                    <RevealText
                      text="Fade in animation"
                      animation="fade"
                      className="text-2xl font-bold"
                    />
                    <RevealText
                      text="Slide up animation"
                      animation="slide"
                      direction="up"
                      className="text-2xl font-bold"
                    />
                    <RevealText
                      text="Scale in animation"
                      animation="scale"
                      className="text-2xl font-bold"
                    />
                    <RevealText
                      text="Bounce in animation"
                      animation="bounce"
                      className="text-2xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Special Effects</h3>
                  <div className="space-y-4">
                    <GradientText
                      text="Gradient text effect"
                      className="text-3xl font-bold"
                    />
                    <ShimmerText
                      text="Shimmer text effect"
                      className="text-3xl font-bold"
                    />
                    <TypewriterText
                      text="Typewriter effect with character animation"
                      className="text-2xl font-bold"
                      stagger={0.05}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

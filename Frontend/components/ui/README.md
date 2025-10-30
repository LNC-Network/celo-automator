# Enhanced UI Components

This directory contains enhanced UI components with modern animations, loaders, and interactive effects inspired by ReactBits.dev.

## Components Overview

### Loading Components

#### LoadingSpinner
Multiple variants of loading spinners with smooth animations.

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

<LoadingSpinner 
  variant="dots" 
  size="lg" 
  color="#3b82f6" 
  text="Loading..." 
/>
```

**Variants:** `default`, `dots`, `pulse`, `wave`, `orbit`, `bounce`
**Sizes:** `sm`, `md`, `lg`, `xl`

#### ProgressLoader
Animated progress indicators with multiple styles.

```tsx
import { ProgressLoader } from '@/components/ui/ProgressLoader'

<ProgressLoader 
  progress={75} 
  variant="circular" 
  size="lg" 
  showPercentage 
  animated 
/>
```

**Variants:** `circular`, `linear`, `step`
**Sizes:** `sm`, `md`, `lg`

#### AnimatedLoader
Specialized loaders for blockchain/crypto applications.

```tsx
import { AnimatedLoader } from '@/components/ui/AnimatedLoader'

<AnimatedLoader 
  type="blockchain" 
  size="xl" 
  text="Connecting to blockchain..." 
/>
```

**Types:** `blockchain`, `crypto`, `network`, `transaction`, `wallet`, `defi`

#### SkeletonLoader
Skeleton loading states for better UX.

```tsx
import { SkeletonLoader, SkeletonCard, SkeletonTable } from '@/components/ui/SkeletonLoader'

<SkeletonCard />
<SkeletonTable rows={5} />
<SkeletonLoader variant="text" lines={3} />
```

### Interactive Components

#### AnimatedButton
Buttons with various animation effects.

```tsx
import { AnimatedButton, GradientButton, NeonButton } from '@/components/ui/AnimatedButton'

<AnimatedButton animation="bounce" icon={<Play />}>
  Play
</AnimatedButton>

<GradientButton>Gradient Button</GradientButton>
<NeonButton>Neon Button</NeonButton>
```

**Animations:** `bounce`, `pulse`, `shake`, `glow`, `ripple`, `magnetic`, `flip`, `wobble`

#### InteractiveCard
Cards with hover effects and animations.

```tsx
import { InteractiveCard, GlassCard, GradientCard, NeonCard } from '@/components/ui/InteractiveCard'

<GlassCard glow>
  <h3>Glass Card</h3>
  <p>Content here</p>
</GlassCard>
```

**Variants:** `default`, `glass`, `gradient`, `neon`, `magnetic`

### Animation Components

#### AnimationWrapper
Wrapper for scroll-triggered animations.

```tsx
import { AnimationWrapper, FadeIn, SlideUp, BounceIn } from '@/components/ui/AnimationWrapper'

<FadeIn delay={0.5}>
  <div>Content</div>
</FadeIn>

<AnimationWrapper animation="slideUp" staggerChildren>
  <div>Item 1</div>
  <div>Item 2</div>
</AnimationWrapper>
```

**Animations:** `fadeIn`, `slideUp`, `slideDown`, `slideLeft`, `slideRight`, `scaleIn`, `rotateIn`, `bounceIn`, `flipIn`, `zoomIn`

#### HoverEffects
Hover effect wrappers.

```tsx
import { HoverEffects, HoverLift, HoverGlow, HoverScale } from '@/components/ui/HoverEffects'

<HoverLift intensity="high">
  <div>Hover to lift</div>
</HoverLift>
```

**Effects:** `lift`, `glow`, `scale`, `rotate`, `tilt`, `shimmer`, `gradient`, `magnetic`

#### RevealText
Text with reveal animations.

```tsx
import { RevealText, GradientText, ShimmerText, TypewriterText } from '@/components/ui/RevealText'

<RevealText 
  text="Animated text" 
  animation="slide" 
  direction="up" 
  stagger={0.1} 
/>

<GradientText text="Gradient text" />
<TypewriterText text="Typewriter effect" />
```

**Animations:** `fade`, `slide`, `scale`, `rotate`, `bounce`, `flip`, `typewriter`

#### ParallaxCard
Parallax scrolling effects.

```tsx
import { ParallaxCard, ParallaxUp, ParallaxScale } from '@/components/ui/ParallaxCard'

<ParallaxUp speed={0.5}>
  <div>Parallax content</div>
</ParallaxUp>
```

### Utility Components

#### LoadingPage
Full-screen loading states.

```tsx
import { LoadingPage, BlockchainLoading, TransactionLoading } from '@/components/ui/LoadingPage'

<BlockchainLoading 
  message="Connecting to blockchain..." 
  progress={75} 
  variant="fullscreen" 
/>
```

## CSS Classes

The following CSS classes are available for custom animations:

- `.animate-fade-in-up`
- `.animate-slide-in-right`
- `.animate-slide-in-left`
- `.animate-scale-in`
- `.animate-glow`
- `.animate-shimmer`
- `.animate-float`
- `.animate-pulse-glow`
- `.animate-bounce`
- `.animate-shake`
- `.animate-wobble`
- `.animate-flip`
- `.animate-zoom-in`
- `.animate-zoom-out`
- `.animate-rotate-in`
- `.animate-slide-in-up`
- `.animate-slide-in-down`
- `.animate-heartbeat`
- `.animate-gradient-shift`
- `.animate-text-shimmer`

## Usage Examples

### Complete Loading State
```tsx
import { LoadingPage, AnimatedLoader, ProgressLoader } from '@/components/ui'

function MyComponent() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  if (loading) {
    return (
      <LoadingPage 
        type="blockchain"
        message="Processing transaction..."
        progress={progress}
        variant="card"
      />
    )
  }

  return (
    <div>
      <AnimatedLoader type="wallet" size="lg" />
      <ProgressLoader progress={progress} variant="linear" />
    </div>
  )
}
```

### Animated Card Grid
```tsx
import { AnimationWrapper, GlassCard, HoverLift } from '@/components/ui'

function CardGrid({ items }) {
  return (
    <AnimationWrapper 
      animation="scaleIn" 
      staggerChildren 
      stagger={0.1}
      className="grid grid-cols-3 gap-4"
    >
      {items.map((item, index) => (
        <HoverLift key={index} intensity="medium">
          <GlassCard glow>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </GlassCard>
        </HoverLift>
      ))}
    </AnimationWrapper>
  )
}
```

### Interactive Button Group
```tsx
import { AnimatedButton, GradientButton, NeonButton } from '@/components/ui'

function ActionButtons() {
  return (
    <div className="flex gap-4">
      <GradientButton 
        animation="bounce"
        icon={<Play />}
        iconPosition="left"
      >
        Start
      </GradientButton>
      
      <NeonButton 
        animation="glow"
        icon={<Settings />}
      >
        Settings
      </NeonButton>
      
      <AnimatedButton 
        animation="magnetic"
        loading={isLoading}
        loadingText="Processing..."
      >
        Process
      </AnimatedButton>
    </div>
  )
}
```

## Performance Notes

- All animations use `framer-motion` for smooth 60fps performance
- Components are optimized with `useCallback` and `useMemo` where appropriate
- Animations respect `prefers-reduced-motion` for accessibility
- Loading states prevent layout shifts with skeleton components

## Accessibility

- All interactive elements have proper ARIA labels
- Animations can be disabled via `prefers-reduced-motion`
- Focus states are clearly visible
- Color contrast meets WCAG guidelines

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Framer Motion requires ES6+ support
- Fallbacks provided for older browsers

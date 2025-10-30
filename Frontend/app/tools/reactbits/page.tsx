"use client"

import React from "react"
import Navbar from "@/components/navbar"
import { GradientText } from "@/components/ui/reactbits/GradientText"
import { Marquee } from "@/components/ui/reactbits/Marquee"
import { MovingBorderCard } from "@/components/ui/reactbits/MovingBorderCard"
import { BentoGrid, BentoItem } from "@/components/ui/reactbits/BentoGrid"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Shield, Wallet, ArrowRight, Activity } from "lucide-react"

export default function ReactBitsShowcase() {
  const badges = [
    "Fast",
    "Responsive",
    "Accessible",
    "Composable",
    "Themed",
    "Tailwind",
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            <GradientText>React Bits</GradientText> for Celo Automator
          </h1>
          <p className="text-muted-foreground mt-2">A small set of polished UI bits integrated into our app.</p>
        </div>

        <div className="mb-8">
          <Marquee speed={90}>
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground text-sm"
              >
                <Sparkles size={14} className="text-primary" /> {b}
              </span>
            ))}
          </Marquee>
        </div>

        <BentoGrid className="mb-10">
          <BentoItem span="lg:col-span-2 lg:row-span-2">
            <div className="h-full flex flex-col gap-4">
              <h3 className="text-xl font-semibold">Animated Gradient Heading</h3>
              <div className="text-4xl sm:text-5xl font-extrabold">
                <GradientText>Automate on Celo with Style</GradientText>
              </div>
              <p className="text-muted-foreground max-w-prose">
                These UI bits are lightweight and theme-friendly. Use them to enhance user experience without adding heavy dependencies.
              </p>
              <div>
                <Button className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </BentoItem>

          <BentoItem>
            <MovingBorderCard>
              <div className="flex items-center gap-3">
                <Wallet className="text-primary" />
                <div>
                  <div className="font-medium">Wallet Connected</div>
                  <div className="text-sm text-muted-foreground">Manage balances, send CELO, and more</div>
                </div>
              </div>
            </MovingBorderCard>
          </BentoItem>

          <BentoItem>
            <MovingBorderCard>
              <div className="flex items-center gap-3">
                <Zap className="text-secondary" />
                <div>
                  <div className="font-medium">Fast Transactions</div>
                  <div className="text-sm text-muted-foreground">Low fees and quick confirmations</div>
                </div>
              </div>
            </MovingBorderCard>
          </BentoItem>

          <BentoItem span="lg:col-span-2">
            <MovingBorderCard>
              <div className="flex items-center gap-3">
                <Shield className="text-success" />
                <div>
                  <div className="font-medium">Security First</div>
                  <div className="text-sm text-muted-foreground">Audited flows and risk checks out of the box</div>
                </div>
              </div>
            </MovingBorderCard>
          </BentoItem>
        </BentoGrid>

        <div className="grid sm:grid-cols-2 gap-6">
          <MovingBorderCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">System Throughput</div>
                <div className="text-2xl font-semibold">234 tx/min</div>
              </div>
              <Activity className="text-accent" />
            </div>
          </MovingBorderCard>

          <MovingBorderCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Avg. Fee</div>
                <div className="text-2xl font-semibold">0.0012 CELO</div>
              </div>
              <Zap className="text-secondary" />
            </div>
          </MovingBorderCard>
        </div>
      </section>
    </main>
  )
}

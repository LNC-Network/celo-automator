"use client"

import React from "react"

type BentoGridProps = {
  children: React.ReactNode
  className?: string
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return (
    <div className={["grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", className].join(" ")}>{children}</div>
  )
}

type BentoItemProps = {
  children: React.ReactNode
  className?: string
  span?: string // tailwind grid span classes
}

export function BentoItem({ children, className = "", span = "lg:col-span-2 lg:row-span-1" }: BentoItemProps) {
  return (
    <div className={[
      "relative rounded-xl border border-border/60 bg-muted/30 backdrop-blur-sm p-4",
      "hover:shadow-lg hover:shadow-primary/5 transition-all",
      span,
      className,
    ].join(" ")}
    >
      {children}
    </div>
  )
}

export default BentoGrid

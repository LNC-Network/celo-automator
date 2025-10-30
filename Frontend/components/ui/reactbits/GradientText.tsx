"use client"

import React from "react"

type GradientTextProps = {
  children: React.ReactNode
  className?: string
  from?: string
  via?: string
  to?: string
  animated?: boolean
}

export function GradientText({
  children,
  className = "",
  from = "from-primary",
  via = "via-secondary",
  to = "to-primary",
  animated = true,
}: GradientTextProps) {
  return (
    <span
      className={[
        "relative inline-block bg-clip-text text-transparent bg-gradient-to-r",
        from,
        via,
        to,
        animated ? "animate-gradient bg-[length:200%_200%]" : "",
        className,
      ].join(" ")}
      style={{
        WebkitBackgroundClip: "text",
      }}
    >
      {children}
    </span>
  )
}

export default GradientText

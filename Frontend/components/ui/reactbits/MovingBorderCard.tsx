"use client"

import React from "react"

type MovingBorderCardProps = {
  children: React.ReactNode
  className?: string
}

export function MovingBorderCard({ children, className = "" }: MovingBorderCardProps) {
  return (
    <div className={["relative rounded-xl p-[1px] bg-transparent", className].join(" ")}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(20,184,166,.6), rgba(6,182,212,.6), transparent 60%)",
          mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          WebkitMask:
            "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          WebkitMaskComposite: "xor",
          animation: "spin 6s linear infinite",
          padding: 1,
        }}
      />
      <div className="relative rounded-[11px] bg-background/70 backdrop-blur-sm border border-border/50 p-4">
        {children}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default MovingBorderCard

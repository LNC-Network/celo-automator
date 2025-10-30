"use client"

import React, { useEffect, useRef } from "react"

type MarqueeProps = {
  children: React.ReactNode
  pauseOnHover?: boolean
  speed?: number // pixels per second
  className?: string
}

export function Marquee({ children, pauseOnHover = true, speed = 80, className = "" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const duration = track.scrollWidth / speed
    track.style.setProperty("--duration", `${duration}s`)
  }, [speed, children])

  return (
    <div
      className={[
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        pauseOnHover ? "group" : "",
        className,
      ].join(" ")}
    >
      <div
        ref={trackRef}
        className={[
          "flex w-max animate-marquee will-change-transform",
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : "",
        ].join(" ")}
      >
        {/* duplicate content for seamless loop */}
        <div className="flex items-center gap-6 pr-6">{children}</div>
        <div className="flex items-center gap-6 pr-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Marquee

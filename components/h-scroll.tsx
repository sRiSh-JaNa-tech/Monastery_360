"use client"

import type React from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { useRef } from "react"

export function HScroll({
  children,
  ariaLabel,
}: {
  children: React.ReactNode
  ariaLabel: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (dx: number) => ref.current?.scrollBy({ left: dx, behavior: "smooth" })
  return (
    <div className="relative mx-auto mt-4 max-w-6xl px-4">
      <button
        aria-label="Scroll left"
        className="absolute -left-2 sm:-left-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-background p-2 shadow md:inline-flex touch-manipulation"
        onClick={() => scrollBy(-240)}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <div
        ref={ref}
        aria-label={ariaLabel}
        className="scrollbar-none flex snap-x snap-mandatory gap-3 sm:gap-4 overflow-x-auto rounded-lg py-2"
      >
        {children}
      </div>
      <button
        aria-label="Scroll right"
        className="absolute -right-2 sm:-right-1 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border bg-background p-2 shadow md:inline-flex touch-manipulation"
        onClick={() => scrollBy(240)}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </div>
  )
}

export function LocationPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] sm:text-xs">
      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 opacity-60" />
      {text}
    </span>
  )
}

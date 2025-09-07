import type React from "react"
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mx-auto mt-8 max-w-6xl px-4 font-serif text-2xl md:text-3xl">{children}</h2>
}

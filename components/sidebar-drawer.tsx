"use client"

import type React from "react"

import Link from "next/link"
import { X, ChevronDown, Hotel, MapPin, Plane, Compass, Scan, BookOpen, Calendar, Home, Bot } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function SidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [bookingsOpen, setBookingsOpen] = useState(true)

  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => onOpenChange(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed left-0 top-0 z-50 h-dvh w-80 max-w-[82vw] border-r bg-background/95 p-4 shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              PL
            </div>
            <div>
              <p className="font-medium leading-none">Pema Lhamo</p>
              <p className="text-xs text-muted-foreground">Traveler</p>
            </div>
          </div>
          <button aria-label="Close menu" onClick={() => onOpenChange(false)} className="rounded-md p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2 text-lg">
          <SidebarLink href="/" icon={<Home className="h-5 w-5" />}>
            Home
          </SidebarLink>
          <SidebarLink href="/planner" icon={<Calendar className="h-5 w-5" />}>
            AI Planner
          </SidebarLink>
          <SidebarLink href="/virtual360" icon={<Scan className="h-5 w-5" />}>
            360° Tours
          </SidebarLink>
          <SidebarLink href="/discover" icon={<Compass className="h-5 w-5" />}>
            Places to discover
          </SidebarLink>
          <SidebarLink href="/packages" icon={<BookOpen className="h-5 w-5" />}>
            Travel Packages
          </SidebarLink>

          <div className="mt-4">
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-2 hover:bg-muted"
              onClick={() => setBookingsOpen((v) => !v)}
            >
              <span className="flex items-center gap-2">
                <Hotel className="h-5 w-5" />
                Bookings
              </span>
              <ChevronDown className={cn("h-5 w-5 transition-transform", bookingsOpen && "rotate-180")} />
            </button>
            <div className={cn("ml-8 mt-2 space-y-2 text-base", !bookingsOpen && "hidden")}>
              <SidebarLink href="/bookings?tab=hotels">• Hotel Bookings</SidebarLink>
              <SidebarLink href="/bookings?tab=restaurants">• Restaurant Bookings</SidebarLink>
              <SidebarLink href="/bookings?tab=taxi">• Taxi Bookings</SidebarLink>
            </div>
          </div>

          <SidebarLink href="/tickets" icon={<Plane className="h-5 w-5" />}>
            Travel Tickets
          </SidebarLink>
          <SidebarLink href="/plans" icon={<Calendar className="h-5 w-5" />}>
            My plans
          </SidebarLink>
          <SidebarLink href="/assistant" icon={<Bot className="h-5 w-5" />}>
            Smart guides
          </SidebarLink>
          <SidebarLink href="/services" icon={<MapPin className="h-5 w-5" />}>
            Available Services
          </SidebarLink>
        </nav>
      </aside>
    </>
  )
}

function SidebarLink({
  href = "#",
  icon,
  children,
}: {
  href?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span>{children}</span>
    </Link>
  )
}

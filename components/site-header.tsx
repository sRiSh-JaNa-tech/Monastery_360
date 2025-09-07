"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, User2, X } from "lucide-react"
import { SidebarDrawer } from "./sidebar-drawer"
import { cn } from "@/lib/utils"

export function SiteHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md", className)}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted touch-manipulation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-serif text-lg sm:text-xl md:text-2xl">
            Monastery360
          </Link>
        </div>

        <nav className="hidden items-center gap-4 sm:gap-6 md:flex">
          <Link className="text-sm hover:underline" href="/">
            Home
          </Link>
          <Link className="text-sm hover:underline" href="/bookings">
            Bookings
          </Link>
          <Link className="text-sm hover:underline" href="/calendar">
            Calendar
          </Link>
          <Link className="text-sm hover:underline" href="/discover">
            Discover
          </Link>
          <Link className="text-sm hover:underline" href="/virtual360">
            360° Tours
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Toggle search"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-muted md:hidden touch-manipulation"
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>

          <form
            action="/bookings"
            method="GET"
            className="hidden items-center gap-2 rounded-full border bg-white px-3 py-2 md:flex"
          >
            <Search className="h-4 w-4 opacity-70" />
            <input
              aria-label="Search"
              name="q"
              placeholder="Search for places..."
              className="w-32 lg:w-48 bg-transparent text-sm outline-none placeholder:text-neutral-500 text-foreground"
            />
          </form>

          <Link
            href="/signin"
            className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-indigo-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 touch-manipulation"
          >
            <User2 className="h-4 w-4" />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
        </div>
      </div>

      {showMobileSearch && (
        <div className="border-t bg-background px-4 py-3 md:hidden">
          <form action="/bookings" method="GET" className="flex gap-2">
            <input
              aria-label="Search"
              name="q"
              placeholder="Search for places..."
              className="flex-1 rounded-lg border bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-500 text-foreground"
            />
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 touch-manipulation">
              Search
            </button>
          </form>
        </div>
      )}

      <SidebarDrawer open={open} onOpenChange={setOpen} />
    </header>
  )
}

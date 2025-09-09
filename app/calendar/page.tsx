
"use client"

import Image from "next/image"
import { useMemo, useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"

type Festival = {
  id: string
  name: string
  date: string
  location: string
  description: string
  image: string
  month: string
  details: string
}

export default function CalendarPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [active, setActive] = useState<Festival | null>(null)
  const [month, setMonth] = useState<string>("All")
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const months = useMemo(() => {
    const uniqueMonths = Array.from(new Set(festivals.map((f) => f.month)))
    return ["All", ...uniqueMonths.sort()]
  }, [festivals])

  const filtered = useMemo(() => {
    if (month === "All") return festivals
    return festivals.filter((f) => f.month === month)
  }, [month, festivals])

  const displayedFestivals = showAll ? filtered : filtered.slice(0, 6)

  useEffect(() => {
    async function fetchFestivals() {
      try {
        console.log("Fetching festivals from database...") // Debug
        const res = await fetch("/api/festivals")
        if (!res.ok) {
          throw new Error(`Failed to fetch festivals: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        console.log("Fetched festivals:", data) // Debug
        setFestivals(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching festivals:", err)
        setError("Failed to load festivals. Please try again later.")
        setLoading(false)
      }
    }

    fetchFestivals()
  }, [])

  if (loading) {
    return (
      <main className="min-h-[100svh] bg-white">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-[100svh] bg-white">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-destructive">{error}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <Image
          src="/pang-lhabsol-sikkim-dance.jpg"
          alt="Snow-clad mountains and villages of Sikkim"
          width={1920}
          height={960}
          className="h-[48svh] w-full object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-sky-900/30 to-emerald-900/40" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col items-start justify-center px-4">
          <h1 className="font-serif text-3xl text-white md:text-5xl text-balance">
            Experience the Beauty & Culture of Sikkim
          </h1>
          <p className="mt-3 max-w-xl text-white/90">
            Plan your journey with festivals, weather updates, and travel insights.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#cultural-calendar"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Explore Festivals
            </a>
            <a
              href="#weather-updates"
              className="rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Check Weather
            </a>
          </div>
        </div>
      </section>

      {/* Cultural Calendar */}
      <section id="cultural-calendar" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Cultural Calendar</h2>
            <p className="mt-2 text-muted-foreground">
              Festivals, monastery events, and cultural highlights. Tap a card to learn more.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="month" className="sr-only">
              Filter by month
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="search-select rounded-md px-3 py-2 text-sm"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid-style list (responsive) */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedFestivals.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f)}
              className="group text-left"
              aria-haspopup="dialog"
              aria-controls="festival-modal"
            >
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
                <Image
                  src={f.image || "/placeholder.svg"}
                  alt={f.name}
                  width={640}
                  height={400}
                  className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="p-4">
                  <h3 className="font-serif text-lg">{f.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {f.date} • {f.location}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">{f.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 ring-1 ring-emerald-600/15">
                      {f.month}
                    </span>
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs text-sky-700 ring-1 ring-sky-600/15">
                      Festival
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Show More Button */}
        {filtered.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

        {/* Modal */}
        {active && (
          <div
            role="dialog"
            aria-modal="true"
            id="festival-modal"
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setActive(null)}
          >
            <div
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={active.image || "/placeholder.svg"}
                alt={active.name}
                width={960}
                height={540}
                className="h-56 w-full object-cover"
              />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl">{active.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {active.date} • {active.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setActive(null)}
                    aria-label="Close details"
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{active.details}</p>
                <div className="mt-5 flex items-center gap-3">
                  <a
                    href="/bookings"
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Plan to Attend
                  </a>
                  <a
                    href="#featured-packages"
                    className="rounded-md bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 ring-1 ring-sky-600/20 hover:bg-sky-100"
                  >
                    View Packages
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Weather & Current Updates */}
      <section id="weather-updates" className="bg-gradient-to-b from-sky-50 to-emerald-50 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl md:text-3xl">Current Weather & Travel Updates</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl border bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-amber-500" fill="currentColor">
                  <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.48 0l1.79-1.8-1.41-1.41-1.8 1.79 1.42 1.42zM12 4a1 1 0 011 1v2a1 1 0 11-2 0V5a1 1 0 011-1zm7 7a1 1 0 110 2h-2a1 1 0 110-2h2zM7 12a1 1 0 110 2H5a1 1 0 110-2h2zm11.24 7.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM12 17a5 5 0 100-10 5 5 0 000 10zm-7.24 2.84l-1.8 1.79 1.41 1.41 1.79-1.79-1.4-1.41z" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Gangtok</p>
                  <p className="text-lg font-medium">18°C • Clear</p>
                </div>
              </div>
              <p className="mt-3 text-sm">Pleasant daytime temperatures; cool evenings. Great for monastery walks.</p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Travel Advisory</p>
                  <p className="text-lg font-medium">Roads Open</p>
                </div>
              </div>
              <p className="mt-3 text-sm">
                NH10 is open; occasional fog after dusk. Carry a light jacket and start early for North Sikkim.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div>
                  <p className="text-sm text-muted-foreground">Seasonal Tips</p>
                  <p className="text-lg font-medium">Spring Bloom</p>
                </div>
              </div>
              <p className="mt-3 text-sm">
                Rhododendrons are in bloom on many trails. Book taxis in advance for Yumthang Valley trips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings Overview */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <h2 className="font-serif text-2xl md:text-3xl">Your Bookings</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            {
              title: "The Elgin Nor-Khill",
              dates: "12–14 Mar",
              meta: "Heritage hotel • Gangtok",
            },
            {
              title: "Rumtek & Lingdum Tour",
              dates: "15 Mar",
              meta: "Guided monastery tour",
            },
            {
              title: "North Sikkim Drive",
              dates: "16–18 Mar",
              meta: "Private taxi • Lachung, Lachen",
            },
          ].map((b) => (
            <div key={b.title} className="rounded-xl border bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h3 className="font-serif text-lg">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.meta}</p>
              <p className="mt-2 text-sm">Dates: {b.dates}</p>
              <div className="mt-4 flex gap-3">
                <a
                  href="/bookings"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  View
                </a>
                <a
                  href="/bookings"
                  className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Manage
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Travel Packages */}
      <section id="featured-packages" className="bg-slate-50 py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-2xl md:text-3xl">Featured Travel Packages</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                title: "Monastery Heritage Tour",
                img: "/monastery-tour-sikkim.jpg",
                copy: "A serene journey through Sikkim’s iconic gompas with guided rituals and local cuisine.",
                price: "₹12,000–₹18,000",
              },
              {
                title: "Lakes of Sikkim",
                img: "/gurudongmar-lake-sikkim.jpg",
                copy: "Crystal lakes and sweeping views—Changu & Gurudongmar with comfortable stays.",
                price: "₹15,000–₹22,000",
              },
              {
                title: "Goecha La Adventure Trek",
                img: "/goecha-la-trek-sikkim.jpg",
                copy: "Epic Himalayan vistas, rhododendron forests, and starlit camps along the trail.",
                price: "₹22,000–₹30,000",
              },
            ].map((p) => (
              <div key={p.title} className="overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5">
                <Image
                  src={p.img || "/placeholder.svg"}
                  alt={p.title}
                  width={640}
                  height={400}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-serif text-lg">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm">{p.copy}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-700">{p.price}</span>
                    <a
                      href="/bookings"
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <h4 className="font-serif text-lg">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="hover:underline" href="/privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/terms">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/faqs">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>+91 98765 43210</li>
              <li>hello@sikkimtourism.example</li>
              <li>MG Marg, Gangtok, Sikkim</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg">Follow</h4>
            <div className="mt-3 flex gap-3">
              <a
                aria-label="Instagram"
                href="#"
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A5.5 5.5 0 1017.5 13 5.5 5.5 0 0012 7.5zm0 2A3.5 3.5 0 1115.5 13 3.5 3.5 0 0112 9.5zM18 6.3a1 1 0 11-1 1 1 1 0 011-1z" />
                </svg>
              </a>
              <a
                aria-label="Twitter/X"
                href="#"
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M20.9 2L13.5 11l7.3 11h-2.7L12 14l-6 8H3.3L10 11 2.9 2h2.7l6.1 8.1L17.1 2h3.8z" />
                </svg>
              </a>
              <a
                aria-label="Facebook"
                href="#"
                className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-2v7A10 10 0 0022 12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sikkim Tourism (Demo). All rights reserved.
        </div>
      </footer>
    </main>
  )
}
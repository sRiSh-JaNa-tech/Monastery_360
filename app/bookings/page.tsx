"use client"

import Image from "next/image"
import Link from "next/link"
import content from "@/data/content.json"
import { useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { HScroll } from "@/components/h-scroll"
import { HotelCard, TaxiCard, RestaurantCard, PlaceCard, EventCard } from "@/components/travel-card"
import { useSearchParams } from "next/navigation"

type TypeKey = "hotel" | "taxi" | "restaurant" | "place" | "event"

const ALL_TYPES: { key: TypeKey; label: string }[] = [
  { key: "hotel", label: "Hotels" },
  { key: "taxi", label: "Taxis" },
  { key: "restaurant", label: "Restaurants" },
  { key: "place", label: "Places to Visit" },
  { key: "event", label: "Cultural Events" },
]

export default function BookingsPage() {
  const params = useSearchParams()
  const initialQ = params.get("q") ?? ""
  const paramFilter = (params.get("filter") ?? "all") as TypeKey | "all"
  const [q, setQ] = useState(initialQ)
  const [active, setActive] = useState<TypeKey | "all">(paramFilter)

  const lower = q.toLowerCase()

  const hotels = useMemo(
    () =>
      (content.hotels || []).filter(
        (h) => !lower || `${h.title} ${h.location} ${h.description ?? ""}`.toLowerCase().includes(lower),
      ),
    [lower],
  )
  const taxis = useMemo(
    () =>
      (content.taxis || []).filter(
        (t) => !lower || `${t.title} ${t.location} ${t.description ?? ""}`.toLowerCase().includes(lower),
      ),
    [lower],
  )
  const restaurants = useMemo(
    () =>
      (content.restaurants || []).filter(
        (r) => !lower || `${r.title} ${r.location} ${r.description ?? ""}`.toLowerCase().includes(lower),
      ),
    [lower],
  )
  const places = useMemo(
    () =>
      (content.places || []).filter(
        (p) => !lower || `${p.title} ${p.location} ${p.description ?? ""}`.toLowerCase().includes(lower),
      ),
    [lower],
  )
  const events = useMemo(
    () =>
      (content.events || []).filter(
        (e) => !lower || `${e.title} ${e.location} ${e.description ?? ""}`.toLowerCase().includes(lower),
      ),
    [lower],
  )

  const show = (type: TypeKey) => active === "all" || active === type

  return (
    <main>
      <SiteHeader />

      <section className="relative mx-auto mt-3 w-full max-w-6xl overflow-hidden rounded-2xl">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bookings%20Page.png-rMDXm3UpdHfUaiChkAgFFyLJdCvSKk.jpeg"
          alt="Discover Beautiful Sikkim"
          width={1600}
          height={650}
          className="h-[280px] sm:h-[320px] md:h-[380px] w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Discover Beautiful Sikkim</h1>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm md:text-base">Book hotels, taxis, restaurants and more.</p>

          <form
            action="/bookings"
            method="GET"
            className="mt-4 sm:mt-6 grid w-full max-w-3xl grid-cols-1 gap-2 rounded-2xl bg-white p-2 shadow backdrop-blur sm:grid-cols-[1fr,auto] md:grid-cols-[1fr,160px,120px]"
          >
            <input
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hotels, restaurants, or taxi services..."
              className="search-input rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-neutral-500 bg-white text-slate-900"
            />
            <select className="search-select rounded-xl border px-3 py-2 text-sm bg-white text-slate-900 hidden sm:block">
              <option>All Locations</option>
              <option>Gangtok</option>
              <option>Pelling</option>
              <option>Lachung</option>
              <option>Namchi</option>
            </select>
            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 touch-manipulation">
              Search
            </button>
          </form>

          <div className="pointer-events-auto mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActive("all")}
              className={`rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium touch-manipulation ${active === "all" ? "bg-indigo-600 text-white" : "bg-white/90 text-foreground"}`}
            >
              All
            </button>
            {ALL_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`rounded-full px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium touch-manipulation ${active === t.key ? "bg-indigo-600 text-white" : "bg-white/90 text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {show("hotel") && (
        <div className="mx-auto mt-6 sm:mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-xl sm:text-2xl md:text-3xl">Hotels in Sikkim</h2>
          <HScroll ariaLabel="Hotels scroller">
            {hotels.map((h) => (
              <HotelCard key={h.id} {...(h as any)} />
            ))}
          </HScroll>
        </div>
      )}

      {show("taxi") && (
        <div className="mx-auto mt-6 max-w-6xl">
          <h2 className="px-4 font-serif text-xl sm:text-2xl md:text-3xl">Taxi Services</h2>
          <HScroll ariaLabel="Taxis scroller">
            {taxis.map((t) => (
              <TaxiCard key={t.id} {...(t as any)} />
            ))}
          </HScroll>
        </div>
      )}

      {show("restaurant") && (
        <div className="mx-auto mt-6 max-w-6xl">
          <h2 className="px-4 font-serif text-xl sm:text-2xl md:text-3xl">Authentic Foods of Sikkim</h2>
          <HScroll ariaLabel="Restaurants scroller">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} {...(r as any)} />
            ))}
          </HScroll>
        </div>
      )}

      {show("place") && (
        <div className="mx-auto mt-6 max-w-6xl">
          <h2 className="px-4 font-serif text-xl sm:text-2xl md:text-3xl">Places to Visit</h2>
          <HScroll ariaLabel="Places scroller">
            {places.map((p) => (
              <PlaceCard key={p.id} {...(p as any)} />
            ))}
          </HScroll>
        </div>
      )}

      {show("event") && (
        <div className="mx-auto mt-6 max-w-6xl">
          <h2 className="px-4 font-serif text-xl sm:text-2xl md:text-3xl">Cultural Events</h2>
          <HScroll ariaLabel="Events scroller">
            {events.map((e) => (
              <EventCard key={e.id} {...(e as any)} />
            ))}
          </HScroll>
        </div>
      )}

      <footer className="mx-auto my-10 max-w-6xl px-4 text-center text-muted-foreground">
        <p className="italic">Team Name</p>
        <p className="text-xs">
          <Link className="underline" href="/">
            Back to Home
          </Link>
        </p>
      </footer>
    </main>
  )
}

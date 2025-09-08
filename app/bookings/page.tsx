
"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { HScroll } from "@/components/h-scroll"
import { HotelCard, TaxiCard, RestaurantCard, PlaceCard, EventCard } from "@/components/travel-card"
import { Loader2 } from "lucide-react"

type TypeKey = "hotel" | "taxi" | "food" | "place" | "event"

const ALL_TYPES: { key: TypeKey; label: string }[] = [
  { key: "hotel", label: "Hotels" },
  { key: "taxi", label: "Taxis" },
  { key: "food", label: "Restaurants" },
  { key: "place", label: "Places to Visit" },
  { key: "event", label: "Cultural Events" },
]

export default function BookingsPage() {
  const params = useSearchParams()
  const router = useRouter()
  const initialQ = params.get("q") ?? ""
  const paramFilter = (params.get("filter") ?? "all") as TypeKey | "all"
  const initialLocation = params.get("location") ?? ""
  const [q, setQ] = useState(initialQ)
  const [active, setActive] = useState<TypeKey | "all">(paramFilter)
  const [location, setLocation] = useState(initialLocation)
  const [data, setData] = useState<Record<TypeKey, any[]>>({
    hotel: [],
    taxi: [],
    food: [],
    place: [],
    event: [],
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<TypeKey | "search", string | null>>({
    hotel: null,
    taxi: null,
    food: null,
    place: null,
    event: null,
    search: null,
  })

  const lower = q.toLowerCase()
  const lowerLocation = location.toLowerCase()

  const fetchAllData = async () => {
    setLoading(true)
    setErrors({ hotel: null, taxi: null, food: null, place: null, event: null, search: null })
    try {
      console.log("Fetching all data from database (Pages Router)...")
      const [hotelsRes, taxisRes, foodsRes, placesRes, eventsRes] = await Promise.all([
        fetch("/api/hotels").catch(() => ({ ok: false, statusText: "Failed to fetch hotels" })),
        fetch("/api/taxis").catch(() => ({ ok: false, statusText: "Failed to fetch taxis" })),
        fetch("/api/foods").catch(() => ({ ok: false, statusText: "Failed to fetch foods" })),
        fetch("/api/places").catch(() => ({ ok: false, statusText: "Failed to fetch places" })),
        fetch("/api/festivals").catch(() => ({ ok: false, statusText: "Failed to fetch festivals" })),
      ])

      const newErrors: Record<TypeKey | "search", string | null> = { ...errors }
      let hasError = false

      const checkResponse = async (res: Response, type: TypeKey) => {
        if (!res.ok) {
          console.error(`Error fetching ${type}: ${res.status} ${res.statusText}`)
          newErrors[type] = res.statusText || `Failed to fetch ${type}`
          hasError = true
          return []
        }
        const data = await res.json()
        console.log(`Fetched ${type} data:`, data)
        return data
      }

      const [hotelsData, taxisData, foodsData, placesData, eventsData] = await Promise.all([
        checkResponse(hotelsRes, "hotel"),
        checkResponse(taxisRes, "taxi"),
        checkResponse(foodsRes, "food"),
        checkResponse(placesRes, "place"),
        checkResponse(eventsRes, "event"),
      ])

      setData({
        hotel: hotelsData,
        taxi: taxisData,
        food: foodsData,
        place: placesData,
        event: eventsData,
      })
      setErrors(newErrors)
      setLoading(false)
      if (hasError) {
        console.error("Errors during fetch:", newErrors)
      }
    } catch (err) {
      console.error("Unexpected error fetching data:", err)
      setErrors({
        hotel: "Failed to load hotels",
        taxi: "Failed to load taxis",
        food: "Failed to load foods",
        place: "Failed to load places",
        event: "Failed to load events",
        search: null,
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const hotels = useMemo(
    () =>
      data.hotel.filter(
        (h) =>
          (!lower || `${h.title} ${h.location} ${h.description ?? ""}`.toLowerCase().includes(lower)) &&
          (!lowerLocation || h.location.toLowerCase().includes(lowerLocation)),
      ),
    [lower, lowerLocation, data.hotel],
  )
  const taxis = useMemo(
    () =>
      data.taxi.filter(
        (t) =>
          (!lower || `${t.title} ${t.location} ${t.description ?? ""}`.toLowerCase().includes(lower)) &&
          (!lowerLocation || t.location.toLowerCase().includes(lowerLocation)),
      ),
    [lower, lowerLocation, data.taxi],
  )
  const foods = useMemo(
    () =>
      data.food.filter(
        (r) =>
          (!lower || `${r.title} ${r.location} ${r.description ?? ""}`.toLowerCase().includes(lower)) &&
          (!lowerLocation || r.location.toLowerCase().includes(lowerLocation)),
      ),
    [lower, lowerLocation, data.food],
  )
  const places = useMemo(
    () =>
      data.place.filter(
        (p) =>
          (!lower || `${p.title} ${p.location} ${p.description ?? ""}`.toLowerCase().includes(lower)) &&
          (!lowerLocation || p.location.toLowerCase().includes(lowerLocation)),
      ),
    [lower, lowerLocation, data.place],
  )
  const events = useMemo(
    () =>
      data.event.filter(
        (e) =>
          (!lower || `${e.name} ${e.location} ${e.description ?? ""}`.toLowerCase().includes(lower)) &&
          (!lowerLocation || e.location.toLowerCase().includes(lowerLocation)),
      ),
    [lower, lowerLocation, data.event],
  )

  const show = (type: TypeKey) => active === "all" || active === type

  const saveSearchToDatabase = async (query: string, filter: string, searchLocation: string) => {
    try {
      const response = await fetch("/api/search-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filter, location: searchLocation }),
      })
      if (!response.ok) {
        throw new Error(`Failed to save search: ${response.statusText}`)
      }
      console.log("Search saved successfully")
    } catch (error) {
      console.error("Error saving search to database:", error)
      setErrors((prev) => ({ ...prev, search: "Failed to save search" }))
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams()
    if (q) newParams.set("q", q)
    if (active !== "all") newParams.set("filter", active)
    if (location) newParams.set("location", location)
    router.push(`/bookings?${newParams.toString()}`)
    saveSearchToDatabase(q, active, location)
  }

  const handleFilterChange = (filter: TypeKey | "all") => {
    setActive(filter)
    const newParams = new URLSearchParams()
    if (q) newParams.set("q", q)
    if (filter !== "all") newParams.set("filter", filter)
    if (location) newParams.set("location", location)
    router.push(`/bookings?${newParams.toString()}`)
    saveSearchToDatabase(q, filter, location)
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    const newParams = new URLSearchParams()
    if (q) newParams.set("q", q)
    if (active !== "all") newParams.set("filter", active)
    if (value) newParams.set("location", value)
    router.push(`/bookings?${newParams.toString()}`)
    saveSearchToDatabase(q, active, value)
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-4 py-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
          <p className="mt-2 text-muted-foreground">Loading bookings...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
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
            onSubmit={handleSearchSubmit}
            className="mt-4 sm:mt-6 grid w-full max-w-3xl grid-cols-1 gap-2 rounded-2xl bg-white p-2 shadow backdrop-blur sm:grid-cols-[1fr,auto] md:grid-cols-[1fr,160px,120px]"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search hotels, restaurants, or taxi services..."
              className="rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-neutral-500 bg-white text-slate-900"
            />
            <select
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="rounded-xl border px-3 py-2 text-sm bg-white text-slate-900 hidden sm:block"
            >
              <option value="">All Locations</option>
              <option>Gangtok</option>
              <option>Pelling</option>
              <option>Lachung</option>
              <option>Namchi</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Search
            </button>
          </form>
          {errors.search && (
            <p className="mt-2 text-sm text-red-400">{errors.search}</p>
          )}

          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                active === "all" ? "bg-indigo-600 text-white" : "bg-white/90 text-foreground hover:bg-white"
              }`}
            >
              All
            </button>
            {ALL_TYPES.map((t) => (
              <button
                key={t.key}
                onClick={() => handleFilterChange(t.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  active === t.key ? "bg-indigo-600 text-white" : "bg-white/90 text-foreground hover:bg-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {show("hotel") && (
        <div className="mx-auto mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-2xl md:text-3xl">Hotels in Sikkim</h2>
          {errors.hotel ? (
            <div className="px-4 py-4 text-center">
              <p className="text-destructive">{errors.hotel}</p>
              <button
                onClick={fetchAllData}
                className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : hotels.length === 0 ? (
            <p className="px-4 py-4 text-center text-muted-foreground">No hotels found matching your criteria.</p>
          ) : (
            <HScroll ariaLabel="Hotels scroller">
              {hotels.map((h) => (
                <HotelCard key={h.id} {...h} />
              ))}
            </HScroll>
          )}
        </div>
      )}

      {show("taxi") && (
        <div className="mx-auto mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-2xl md:text-3xl">Taxi Services</h2>
          {errors.taxi ? (
            <div className="px-4 py-4 text-center">
              <p className="text-destructive">{errors.taxi}</p>
              <button
                onClick={fetchAllData}
                className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : taxis.length === 0 ? (
            <p className="px-4 py-4 text-center text-muted-foreground">No taxis found matching your criteria.</p>
          ) : (
            <HScroll ariaLabel="Taxis scroller">
              {taxis.map((t) => (
                <TaxiCard key={t.id} {...t} />
              ))}
            </HScroll>
          )}
        </div>
      )}

      {show("food") && (
        <div className="mx-auto mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-2xl md:text-3xl">Authentic Foods of Sikkim</h2>
          {errors.food ? (
            <div className="px-4 py-4 text-center">
              <p className="text-destructive">{errors.food}</p>
              <button
                onClick={fetchAllData}
                className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : foods.length === 0 ? (
            <p className="px-4 py-4 text-center text-muted-foreground">No restaurants found matching your criteria.</p>
          ) : (
            <HScroll ariaLabel="Foods scroller">
              {foods.map((r) => (
                <RestaurantCard key={r.id} {...r} />
              ))}
            </HScroll>
          )}
        </div>
      )}

      {show("place") && (
        <div className="mx-auto mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-2xl md:text-3xl">Places to Visit</h2>
          {errors.place ? (
            <div className="px-4 py-4 text-center">
              <p className="text-destructive">{errors.place}</p>
              <button
                onClick={fetchAllData}
                className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : places.length === 0 ? (
            <p className="px-4 py-4 text-center text-muted-foreground">No places found matching your criteria.</p>
          ) : (
            <HScroll ariaLabel="Places scroller">
              {places.map((p) => (
                <PlaceCard key={p.id} {...p} />
              ))}
            </HScroll>
          )}
        </div>
      )}

      {show("event") && (
        <div className="mx-auto mt-8 max-w-6xl">
          <h2 className="px-4 font-serif text-2xl md:text-3xl">Cultural Events</h2>
          {errors.event ? (
            <div className="px-4 py-4 text-center">
              <p className="text-destructive">{errors.event}</p>
              <button
                onClick={fetchAllData}
                className="mt-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <p className="px-4 py-4 text-center text-muted-foreground">No events found matching your criteria.</p>
          ) : (
            <HScroll ariaLabel="Events scroller">
              {events.map((e) => (
                <EventCard key={e.id} {...e} />
              ))}
            </HScroll>
          )}
        </div>
      )}

      <footer className="mx-auto my-10 max-w-6xl px-4 text-center text-muted-foreground">
        <p className="italic">Team Name</p>
        <p className="text-xs">
          <Link className="underline" href="/">Back to Home</Link>
        </p>
      </footer>
    </main>
  )
}
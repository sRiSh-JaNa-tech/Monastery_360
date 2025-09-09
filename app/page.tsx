
"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { SectionHeading } from "@/components/section-heading"
import { HScroll } from "@/components/h-scroll"
import { PlaceCard, PackageCard, HotelCard } from "@/components/travel-card"
import { CtaBanner } from "@/components/cta-banner"

// Define interfaces for data types
interface Place {
  id: string
  title: string
  images: string[] // Updated to match schema's Json array
  description?: string
  isTopVisited?: boolean
}

interface Package {
  id: string
  title: string
  image: string
  description?: string
}

interface Hotel {
  id: string
  title: string
  image: string
  description?: string
}

export default function HomePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data from database...") // Debug
        const [placesRes, packagesRes, hotelsRes] = await Promise.all([
          fetch("/api/places"),
          fetch("/api/packages"),
          fetch("/api/hotels"),
        ])

        if (!placesRes.ok || !packagesRes.ok || !hotelsRes.ok) {
          throw new Error("Failed to fetch data from one or more endpoints")
        }

        const placesData = await placesRes.json()
        const packagesData = await packagesRes.json()
        const hotelsData = await hotelsRes.json()

        console.log("Places:", placesData) // Debug
        console.log("Packages:", packagesData) // Debug
        console.log("Hotels:", hotelsData) // Debug

        // Ensure images are handled correctly
        setPlaces(placesData.map(p => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : ["/placeholder.svg"],
        })))
        setPackages(packagesData)
        setHotels(hotelsData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 text-center">
        <SiteHeader />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 text-center">
        <SiteHeader />
        <p className="text-destructive">{error}</p>
      </main>
    )
  }

  return (
    <main>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SiteHeader />
      <Hero />

      <SectionHeading>Top Visited</SectionHeading>
      <HScroll ariaLabel="Top visited monasteries">
        {places.filter((p) => p.isTopVisited).map((p) => (
          <a href={`/travel-card?type=place&id=${p.id}`} key={p.id} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
            <PlaceCard {...p} />
          </a>
        ))}
      </HScroll>

      <CtaBanner
        href="/bookings?filter=place"
        image="/home-monastery.jpg"
        title="Featuring Monasteries"
        subtitle="Explore history, rituals, and breathtaking architecture."
      />

      <SectionHeading>Travel Packages</SectionHeading>
      <HScroll ariaLabel="Travel packages">
        {packages.map((pkg) => (
          <a href={`/travel-card?type=package&id=${pkg.id}`} key={pkg.id} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
            <PackageCard {...pkg} />
          </a>
        ))}
      </HScroll>

      <CtaBanner
        href="/bookings?filter=place"
        image="/virtual-360-hotel-night.jpg"
        title="Virtual360 Tour"
        subtitle="Step inside monasteries and heritage sites—right from your screen."
      />

      <SectionHeading>Top Hotels</SectionHeading>
      <HScroll ariaLabel="Top hotels">
        {hotels.map((h) => (
          <a href={`/travel-card?type=hotel&id=${h.id}`} key={h.id} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
            <HotelCard {...h} />
          </a>
        ))}
      </HScroll>

      <CtaBanner
        href="/assistant"
        image="/home-kar.jpg"
        title="Smart Guide Assistant"
        subtitle="Chat with a local-style AI to plan, find and book in minutes."
      />

      <footer className="mx-auto my-10 max-w-6xl px-4 text-center text-muted-foreground">
        <p className="italic">The Guilded Quill</p>
      </footer>
    </main>
  )
}
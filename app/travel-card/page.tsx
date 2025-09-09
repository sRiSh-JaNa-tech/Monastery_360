
"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Head from "next/head"
import { SiteHeader } from "@/components/site-header"

// Define interfaces based on the Prisma schema
interface Place {
  id: string
  title: string
  images: string[]
  video?: string
  description?: string
  lat?: number
  lng?: number
  access?: string
  isTopVisited?: boolean
  content?: string
  createdAt: Date
  updatedAt: Date
}

interface Package {
  id: string
  title: string
  image: string
  duration: string
  price: number
  tags?: string[]
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface Hotel {
  id: string
  title: string
  image: string
  description?: string
  location: string
  rating: number
  price: number
  lat?: number
  lng?: number
  access?: string
  createdAt: Date
  updatedAt: Date
}

// Flexible type to handle any API response
type ApiResponse = Partial<Place | Package | Hotel> & { [key: string]: any }

export default function TravelCardPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("useEffect triggered", { type, id }) // Debug: Confirm useEffect runs
    if (!type || !id) {
      setError("Invalid URL parameters")
      setLoading(false)
      return
    }

    async function fetchDetailedData() {
      try {
        let endpoint = ""
        switch (type) {
          case "place":
            endpoint = `/api/places?id=${id}`
            break
          case "package":
            endpoint = `/api/packages?id=${id}`
            break
          case "hotel":
            endpoint = `/api/hotels?id=${id}`
            break
          default:
            throw new Error("Invalid card type")
        }

        console.log(`Fetching from: ${endpoint}`) // Debug
        const res = await fetch(endpoint, { cache: "no-store" })
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`HTTP error! status: ${res.status}, response: ${errorText}`)
        }

        const detailedData = await res.json()
        console.log("Raw fetched data:", detailedData) // Debug raw response
        if (!detailedData || typeof detailedData !== "object") {
          throw new Error("Invalid data format from API")
        }

        // Ensure image fields are present
        if (type === "place" && detailedData.images) {
          detailedData.images = Array.isArray(detailedData.images) ? detailedData.images : ["/placeholder.svg"]
        } else if ((type === "package" || type === "hotel") && !detailedData.image) {
          detailedData.image = "/placeholder.svg"
        }

        console.log("Processed data:", detailedData) // Debug processed data
        setData(detailedData)
        setLoading(false)
      } catch (err) {
        console.error(`Error fetching ${type} data:`, err)
        setError(`Failed to load ${type} details. ${err.message}`)
        setLoading(false)
      }
    }

    fetchDetailedData()
  }, [type, id])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 text-center">
        <SiteHeader />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 text-center">
        <SiteHeader />
        <p className="text-destructive">{error || "Data not found"}</p>
        {data && <pre className="text-sm text-muted-foreground">{JSON.stringify(data, null, 2)}</pre>} {/* Debug raw data */}
      </main>
    )
  }

  return (
    <main>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{data.title} - Details</title>
      </Head>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <article className="rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="font-serif text-2xl font-medium">{data.title || "No Title"}</h1>

          {/* Main Image */}
          {(type === "place" && data.images && data.images.length > 0) ? (
            <img
              src={data.images[0]}
              alt={`${data.title} main image`}
              className="mt-4 w-full rounded-lg object-cover"
              style={{ height: "300px" }}
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; console.log("Main image failed, using placeholder") }}
            />
          ) : (
            <img
              src={data.image || "/placeholder.svg"}
              alt={`${data.title} main image`}
              className="mt-4 w-full rounded-lg object-cover"
              style={{ height: "300px" }}
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; console.log("Main image failed, using placeholder") }}
            />
          )}

          {/* Additional Images for Place */}
          {type === "place" && data.images && data.images.length > 1 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${data.title} image ${index + 2}`}
                  className="rounded-lg object-cover"
                  style={{ height: "150px" }}
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; console.log(`Image ${index + 2} failed, using placeholder`) }}
                />
              ))}
            </div>
          )}

          {/* Dynamic Fields */}
          {data.description && (
            <p className="mt-4 text-muted-foreground">{data.description}</p>
          )}
          {("location" in data && data.location) && (
            <p className="mt-2 text-sm"><strong>Location:</strong> {data.location}</p>
          )}
          {("rating" in data && data.rating) && (
            <p className="mt-2 text-sm"><strong>Rating:</strong> ⭐ {data.rating.toFixed(1)}</p>
          )}
          {("price" in data && data.price) && (
            <p className="mt-2 text-sm"><strong>Price:</strong> ₹{data.price.toLocaleString()}{type === "hotel" ? "/night" : ""}</p>
          )}
          {("duration" in data && data.duration) && (
            <p className="mt-2 text-sm"><strong>Duration:</strong> {data.duration}</p>
          )}
          {("tags" in data && data.tags) && (
            <p className="mt-2 text-sm"><strong>Tags:</strong> {Array.isArray(data.tags) ? data.tags.join(", ") : "N/A"}</p>
          )}
          {("video" in data && data.video) && (
            <p className="mt-2 text-sm"><strong>Video:</strong> <a href={data.video} target="_blank" rel="noopener noreferrer">{data.video}</a></p>
          )}
          {("lat" in data && "lng" in data && data.lat && data.lng) && (
            <p className="mt-2 text-sm"><strong>Coordinates:</strong> Lat: {data.lat}, Lng: {data.lng}</p>
          )}
          {("access" in data && data.access) && (
            <p className="mt-2 text-sm"><strong>Access:</strong> {data.access}</p>
          )}
          {("isTopVisited" in data && data.isTopVisited !== undefined) && (
            <p className="mt-2 text-sm"><strong>Top Visited:</strong> {data.isTopVisited ? "Yes" : "No"}</p>
          )}
          {("content" in data && data.content) && (
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: data.content }} />
          )}
          {("createdAt" in data && data.createdAt) && (
            <p className="mt-2 text-sm"><strong>Created:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
          )}
          {("updatedAt" in data && data.updatedAt) && (
            <p className="mt-2 text-sm"><strong>Updated:</strong> {new Date(data.updatedAt).toLocaleDateString()}</p>
          )}

          <a
            href={`/bookings?filter=${type}`}
            className="mt-6 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Book Now
          </a>
        </article>
      </section>
      <footer className="mx-auto my-10 max-w-6xl px-4 text-center text-muted-foreground">
        <p className="italic">Team Name</p>
      </footer>
    </main>
  )
}
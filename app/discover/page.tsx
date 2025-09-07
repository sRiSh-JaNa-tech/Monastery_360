
"use client"

import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import Image from "next/image"

type Place = {
  id: string
  title: string
  content: string
  images: string[]
  video?: string
}

export default function DiscoverPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [videoOpen, setVideoOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlaces() {
      try {
        console.log("Fetching places from database...") // Debug
        const res = await fetch("/api/places")
        if (!res.ok) {
          throw new Error(`Failed to fetch places: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        // Sanitize images and content
        const sanitizedData = data.map((place: any) => ({
          ...place,
          images: Array.isArray(place.images) ? place.images : [],
          content: typeof place.content === "string" ? place.content : ""
        }))
        console.log("Fetched places:", sanitizedData) // Debug
        setPlaces(sanitizedData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching places:", err)
        setError("Failed to load places. Please try again later.")
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in")
      elements.forEach((el) => {
        const top = el.getBoundingClientRect().top
        if (top < window.innerHeight - 150) el.classList.add("visible")
      })
    }
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("load", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("load", handleScroll)
    }
  }, [])

  const scrollToPlaces = () => {
    const element = document.getElementById("places")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const openModal = (place: Place) => {
    setSelectedPlace(place)
    setModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setModalOpen(false)
    document.body.style.overflow = "auto"
  }

  const displayedPlaces = showAll ? places : places.slice(0, 6)

  if (loading) {
    return (
      <main className="bg-gray-50">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-gray-50">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-destructive">{error}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="bg-gray-50">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative w-full h-[70vh]">
        <Image
          src="/goecha-la-trek-sikkim.jpg"
          alt="Sikkim landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-sky-900/30 to-emerald-900/40" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col items-start justify-center px-4 text-white">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Places to Discover
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90">
            Hidden Gems of Sikkim for Researchers & Visitors
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToPlaces}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Explore Places
            </button>
          </div>
        </div>
      </section>

      {/* Places Section */}
      <section id="places" className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
            Must-Visit Monasteries & Heritage Sites
          </h2>
          <p className="text-xl text-gray-600">
            Explore Sikkim’s culture, religion, and ecology through these iconic sites
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedPlaces.map((place) => {
            console.log(`Rendering place: ${place.title}, content:`, place.content) // Debug
            return (
              <button
                key={place.id}
                onClick={() => openModal(place)}
                className="group text-left"
                aria-haspopup="dialog"
                aria-controls="place-modal"
              >
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
                  <Image
                    src={place.images.length > 0 ? place.images[0] : "/placeholder.svg"}
                    alt={place.title}
                    width={640}
                    height={400}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="p-4">
                    <h3 className="font-serif text-lg">{place.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {place.content ? place.content.substring(0, 100) + "..." : "No description available"}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 ring-1 ring-emerald-600/15">
                        Monastery
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Show More Button */}
        {places.length > 6 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-green-50 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
            Tips for Visiting Sikkim
          </h2>
          <p className="text-xl text-gray-600">
            Practical advice for researchers and travelers to make the most of your journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Best Time to Visit</h3>
            <p>
              Spring (March–May) and Autumn (September–November) are ideal for clear skies,
              pleasant weather, and festivals.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Local Etiquette</h3>
            <p>
              Dress modestly, remove shoes before entering monasteries, and seek permission
              before photography.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Travel Essentials</h3>
            <p>
              Carry warm clothing, good trekking shoes, rain protection, and eco-friendly
              water bottles.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Research Preparation</h3>
            <p>
              Carry a notebook, camera, and permissions if documenting cultural or ecological
              aspects.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Transportation</h3>
            <p>
              Prefer shared jeeps or local guides for remote areas; plan trips considering
              altitude and road conditions.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 fade-in">
            <h3 className="text-2xl font-semibold mb-2">Sustainable Travel</h3>
            <p>
              Avoid littering, respect wildlife, support local handicrafts, and follow eco-tourism
              practices.
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && selectedPlace && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          id="place-modal"
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 font-serif">
                {selectedPlace.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4">
              {selectedPlace.content ? (
                <div dangerouslySetInnerHTML={{ __html: selectedPlace.content }} />
              ) : (
                <p className="text-sm text-muted-foreground">No content available</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {selectedPlace.images.length > 0 ? (
                  selectedPlace.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-full h-48 relative rounded-lg overflow-hidden shadow-md"
                    >
                      <Image
                        src={img}
                        alt={`${selectedPlace.title} image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No images available</p>
                )}
              </div>
              {selectedPlace.video && (
                <button
                  onClick={() => {
                    setVideoUrl(selectedPlace.video!)
                    setVideoOpen(true)
                  }}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-lg transition"
                >
                  Watch Video Tour
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        >
          <div
            className="w-full max-w-6xl h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain rounded-xl shadow-lg"
            />
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              aria-label="Close video"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
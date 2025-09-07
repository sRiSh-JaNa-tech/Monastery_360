"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

// Updated data for the six monasteries with correct image and HTML file paths
const monasteries = [
  {
    id: "lingdum",
    name: "Lingdum Monastery",
    description: "Serene prayer halls and classic Tibetan lines welcome the sunrise in this vibrant monastic complex near Gangtok.",
    image: "Monastery_3d/Photos/lingdum1.jpg",
    location: "Gangtok, Sikkim",
    htmlFile: "/Monastery_3d/lingdum3d.html",
  },
  {
    id: "lhabrung",
    name: "Lhabrung Monastery",
    description: "Home to vibrant rituals and sacred relics, offering a peaceful and reflective ambience in the hills of East Sikkim.",
    image: "Monastery_3d/Photos/labrang.jpg",
    location: "East Sikkim",
    htmlFile: "/Monastery_3d/labrang3d.html",
  },
  {
    id: "rumtek",
    name: "Rumtek Monastery",
    description: "The grand seat of the Karmapa, featuring a resplendent golden stupa and vast courtyards echoing with history.",
    image: "Monastery_3d/Photos/rumtek1.jpeg",
    location: "Gangtok, Sikkim",
    htmlFile: "/Monastery_3d/rumtek3d.html",
  },
  {
    id: "pemayangtse",
    name: "Pemayangtse Monastery",
    description: "A historic monastery offering sweeping dusk views of Kanchenjunga, one of the oldest in Sikkim.",
    image: "Monastery_3d/Photos/pemyangtse1.jpeg",
    location: "Pelling, West Sikkim",
    htmlFile: "/Monastery_3d/Pemyangtse3d.html",
  },
  {
    id: "phodang",
    name: "Phodang Monastery",
    description: "Known for its bright murals, intricate woodwork, and the cheerful prayer flags that flutter in the mountain breeze.",
    image: "Monastery_3d/Photos/Phodong_monastery.jpg",
    location: "North Sikkim",
    htmlFile: "/Monastery_3d/phodong3d.html",
  },
  {
    id: "tashiding",
    name: "Tashiding Monastery",
    description: "Perched on a heart-shaped hill, this sacred site is believed to cleanse sins and is a major pilgrimage destination.",
    image: "Monastery_3d/Photos/tashiding2.jpg",
    location: "West Sikkim",
    htmlFile: "/Monastery_3d/tashiding3d.html",
  },
]

export default function Virtual360Page() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Updated function to open the HTML file directly
  const handleCardClick = (htmlFilePath: string) => {
    window.location.href = htmlFilePath;
  }

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.28)), url('Monastery_3d/Photos/mountain1.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <SiteHeader />
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Sikkim Monasteries 360°</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Immerse yourself in the beauty and spiritual tranquility of Sikkim's most iconic monasteries through our interactive virtual tours.
          </p>
        </div>

        {/* Monastery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {monasteries.map((monastery) => (
            <Card
              key={monastery.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-blue-50 hover:bg-blue-100 border border-blue-200 overflow-hidden`}
              onMouseEnter={() => setHoveredCard(monastery.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(monastery.htmlFile)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={monastery.image || "/placeholder.svg"}
                  alt={monastery.name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* 360° Tour Indicator */}
                <div className="absolute bottom-4 right-4 bg-blue-600/90 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group-hover:bg-blue-600 group-hover:scale-110">
                  <RotateCcw
                    className={`w-5 h-5 text-white transition-transform duration-1000 ${
                      hoveredCard === monastery.id ? "animate-spin" : ""
                    }`}
                  />
                </div>

                {/* Location Badge */}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-muted-foreground">{monastery.location}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-foreground transition-colors">
                  {monastery.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{monastery.description}</p>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation() // Prevents the card's onClick from firing again
                    handleCardClick(monastery.htmlFile)
                  }}
                >
                  Start 360° Tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
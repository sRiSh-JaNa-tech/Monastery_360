
import Image from "next/image"
import Link from "next/link"
import { LocationPill } from "./h-scroll"

type BaseCard = {
  id: string
  title: string
  image?: string // Optional to handle cases where image might be missing
}

type PlaceCard = BaseCard & {
  images: string[] // Updated to match schema
  location?: string
  description?: string
  isTopVisited?: boolean
}

type PackageCard = BaseCard & {
  duration: string
  description: string
  price: number
}

type HotelCard = BaseCard & {
  location: string
  rating: number
  price: number
}

type SimpleCard = {
  id: string
  title: string
  image?: string
  location?: string
  rating?: number
  priceLabel?: string
  description?: string
}

export function PlaceCard({ id, title, images, location, description }: PlaceCard) {
  const imageUrl = images && images.length > 0 ? images[0] : "/placeholder.svg"
  return (
    <Link href={`/travel-card?type=place&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          {location ? <LocationPill text={location} /> : null}
          {description ? (
            <p className="mt-1 line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          ) : null}
          <span className="mt-1 inline-block text-[11px] sm:text-xs font-medium text-primary">View details</span>
        </div>
      </article>
    </Link>
  )
}

export function PackageCard({ id, title, image, duration, description, price }: PackageCard) {
  return (
    <Link href={`/travel-card?type=package&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">{duration}</p>
          <p className="line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">₹{price.toLocaleString()}</span>
            <span className="btn-secondary rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-white touch-manipulation">
              Book
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function HotelCard({ id, title, image, location, rating, price }: HotelCard) {
  return (
    <Link href={`/travel-card?type=hotel&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          <div className="flex items-center justify-between">
            <LocationPill text={location} />
            <span className="text-[11px] sm:text-xs">⭐ {rating.toFixed(1)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">₹{price}/night</span>
            <span className="btn-primary rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-white touch-manipulation">
              Book
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function TaxiCard({ id, title, image, location, priceLabel, rating, description }: SimpleCard) {
  return (
    <Link href={`/travel-card?type=taxi&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          {location ? <LocationPill text={location} /> : null}
          {description ? (
            <p className="line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">{priceLabel}</span>
            <span className="text-[11px] sm:text-xs">⭐ {rating?.toFixed?.(1) ?? "4.5"}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function RestaurantCard({ id, title, image, location, priceLabel, rating, description }: SimpleCard) {
  return (
    <Link href={`/travel-card?type=restaurant&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          {location ? <LocationPill text={location} /> : null}
          {description ? (
            <p className="line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">{priceLabel}</span>
            <span className="text-[11px] sm:text-xs">⭐ {rating?.toFixed?.(1) ?? "4.4"}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function EventCard({ id, title, image, location, description }: SimpleCard) {
  return (
    <Link href={`/travel-card?type=event&id=${id}`} className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] snap-start">
      <article className="card-hover h-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={240}
          className="h-28 sm:h-32 md:h-36 w-full rounded-t-lg object-cover"
        />
        <div className="space-y-1 p-3">
          <h3 className="font-serif text-xs sm:text-sm font-medium leading-snug">{title}</h3>
          {location ? <LocationPill text={location} /> : null}
          {description ? (
            <p className="line-clamp-2 text-[11px] sm:text-xs text-muted-foreground">{description}</p>
          ) : null}
          <span className="mt-2 inline-block text-xs sm:text-sm font-medium text-primary">See schedule</span>
        </div>
      </article>
    </Link>
  )
}
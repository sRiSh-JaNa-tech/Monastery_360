import { notFound } from "next/navigation"
import Link from "next/link"
import { type ItemType, findByTypeAndId, allByType } from "@/lib/content"
import { SiteHeader } from "@/components/site-header"
import { HScroll } from "@/components/h-scroll"
import { SectionHeading } from "@/components/section-heading"
import { HotelCard, PackageCard, TaxiCard, PlaceCard, RestaurantCard, EventCard } from "@/components/travel-card"
import { Button } from "@/components/ui/button"

export default function BookingDetail({
  params,
}: {
  params: { type: ItemType; id: string }
}) {
  const item = findByTypeAndId(params.type, params.id)
  if (!item) return notFound()

  const suggestions = allByType(params.type)
    .filter((i) => i.id !== item.id)
    .slice(0, 12)

  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-4xl px-4 py-6">
        <div className="overflow-hidden rounded-xl">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="h-[260px] w-full object-cover md:h-[340px]"
          />
        </div>

        <h1 className="mt-4 text-pretty text-2xl font-semibold md:text-3xl">{item.title}</h1>
        {item.location ? <p className="text-muted-foreground">{item.location}</p> : null}

        {item.priceLabel ? <p className="mt-2 font-medium text-primary">{item.priceLabel}</p> : null}

        {item.description ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p> : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {(item.tags ?? []).map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Button className="w-full md:w-auto">Book Now</Button>
        </div>
      </article>

      <SectionHeading>Suggested {sectionTitle(params.type)}</SectionHeading>
      <HScroll ariaLabel="Suggestions">
        {suggestions.map((s) => {
          const props = { ...(s as any) }
          switch (params.type) {
            case "hotel":
              return <HotelCard key={s.id} {...props} />
            case "package":
              return <PackageCard key={s.id} {...props} />
            case "taxi":
              return <TaxiCard key={s.id} {...props} />
            case "place":
              return <PlaceCard key={s.id} {...props} />
            case "restaurant":
              return <RestaurantCard key={s.id} {...props} />
            case "event":
              return <EventCard key={s.id} {...props} />
            case "monastery":
            default:
              return <PlaceCard key={s.id} {...props} />
          }
        })}
      </HScroll>

      <footer className="mx-auto my-10 max-w-6xl px-4 text-center text-muted-foreground">
        <p className="italic">Team Name</p>
        <p className="text-xs">
          <Link className="underline" href="/bookings">
            Back to Bookings
          </Link>
        </p>
      </footer>
    </main>
  )
}

function sectionTitle(t: ItemType) {
  switch (t) {
    case "hotel":
      return "Hotels"
    case "package":
      return "Packages"
    case "taxi":
      return "Taxis"
    case "restaurant":
      return "Restaurants"
    case "place":
      return "Places"
    case "event":
      return "Events"
    case "monastery":
      return "Monasteries"
    default:
      return "Items"
  }
}

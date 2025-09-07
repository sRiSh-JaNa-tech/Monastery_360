import content from "@/data/content.json"

export type ItemType = "monastery" | "package" | "hotel" | "taxi" | "restaurant" | "place" | "event"

export type Item = {
  id: string
  type: ItemType
  title: string
  location?: string
  image: string
  rating?: number
  priceLabel?: string // Handle both price (packages, hotels) and priceLabel (restaurants, taxis)
  description?: string
  tags?: string[]
  lat?: number
  lng?: number
  access?: "full" | "partial" | "limited"
}

export function allByType<T extends ItemType>(type: T): Item[] {
  const map: Record<string, any[]> = {
    monastery: content.topVisited,
    package: content.packages,
    hotel: content.hotels,
    taxi: content.taxis,
    restaurant: content.restaurants,
    place: content.places,
    event: content.events,
  }
  return (map[type] || []).map((item) => ({
    ...item,
    type,
    // Normalize price vs. priceLabel
    priceLabel: item.priceLabel ?? (item.price ? `₹${item.price}` : undefined),
    // Ensure tags is an array (empty if undefined)
    tags: item.tags ?? [],
  }))
}

export function findByTypeAndId(type: ItemType, id: string): Item | undefined {
  return allByType(type).find((i) => i.id === id)
}

export function searchItems(q: string, types?: ItemType[]): Item[] {
  const list: Item[] = types?.length
    ? types.flatMap((type) => allByType(type))
    : [
        ...allByType("monastery"),
        ...allByType("package"),
        ...allByType("hotel"),
        ...allByType("taxi"),
        ...allByType("restaurant"),
        ...allByType("place"),
        ...allByType("event"),
      ]
  const query = q.trim().toLowerCase()
  if (!query) return list
  return list.filter((i) => {
    const hay = `${i.title} ${i.location ?? ""} ${i.description ?? ""} ${(i.tags ?? []).join(" ")}`
    return hay.toLowerCase().includes(query)
  })
}
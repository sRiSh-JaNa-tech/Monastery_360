import { SiteHeader } from "@/components/site-header"

export default function TicketsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Travel Tickets</h1>
        <p className="mt-2 text-muted-foreground">Book flights and inter-city buses integrated with your itinerary.</p>
      </section>
    </main>
  )
}

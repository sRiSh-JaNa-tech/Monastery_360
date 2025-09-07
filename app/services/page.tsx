import { SiteHeader } from "@/components/site-header"

export default function ServicesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Available Services</h1>
        <p className="mt-2 text-muted-foreground">Local guides, permits, rentals, and on-call assistance.</p>
      </section>
    </main>
  )
}

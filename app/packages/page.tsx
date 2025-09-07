import { SiteHeader } from "@/components/site-header"

export default function PackagesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Travel Packages</h1>
        <p className="mt-2 text-muted-foreground">Browse and compare packages by duration, theme, and budget.</p>
      </section>
    </main>
  )
}

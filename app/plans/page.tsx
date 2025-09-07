import { SiteHeader } from "@/components/site-header"

export default function PlansPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">My Plans</h1>
        <p className="mt-2 text-muted-foreground">Save, edit, and share your upcoming monastery trips.</p>
      </section>
    </main>
  )
}

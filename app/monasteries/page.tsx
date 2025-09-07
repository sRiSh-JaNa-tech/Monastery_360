import { SiteHeader } from "@/components/site-header"

export default function MonasteriesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-serif text-3xl">Featuring Monasteries</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Dive deep into the legends, architecture and rituals of Sikkim’s celebrated monasteries.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border p-4">
              <img
                src={`/featured-monastery-.jpg?height=220&width=580&query=featured monastery ${i}`}
                alt=""
                className="h-48 w-full rounded-lg object-cover"
              />
              <h3 className="mt-3 font-serif text-xl">Monastery {i}</h3>
              <p className="text-sm text-muted-foreground">Story, visiting hours, etiquette and nearby spots.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

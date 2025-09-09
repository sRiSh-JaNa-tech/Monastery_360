import Image from "next/image"

export function Hero() {
  const src =
    "/home-mountain.jpg"
  return (
    <section className="relative mx-auto mt-2 w-full max-w-6xl overflow-hidden rounded-2xl">
      <Image
        src={src || "/placholder.svg"}
        alt="Sikkim mountains and monasteries"
        width={1600}
        height={700}
        className="h-[360px] w-full object-cover"
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-pretty font-serif text-3xl leading-tight drop-shadow md:text-5xl">
          Experience Sikkim’s Monasteries
        </h1>
        <p className="mt-2 max-w-xl text-balance text-sm md:text-base">
          A digital heritage platform to explore sacred spaces, scenic valleys, and unforgettable journeys.
        </p>

        <form
          action="/bookings"
          method="GET"
          className="pointer-events-auto mt-6 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 text-foreground shadow"
        >
          <input
            name="q"
            className="flex-1 rounded-full bg-white px-3 py-2 text-sm outline-none placeholder:text-neutral-500"
            placeholder="Search hotels, monasteries, taxi services..."
            aria-label="Search"
          />
          <button className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Search
          </button>
        </form>
      </div>
    </section>
  )
}

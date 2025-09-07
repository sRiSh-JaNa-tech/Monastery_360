import Image from "next/image"
import Link from "next/link"

export function CtaBanner({
  image,
  title,
  subtitle,
  href,
}: {
  image: string
  title: string
  subtitle?: string
  href: string
}) {
  return (
    <Link href={href} className="mx-auto mt-8 block w-full max-w-6xl overflow-hidden rounded-2xl">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={1600}
          height={600}
          className="h-56 w-full object-cover md:h-64"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center p-6">
          <div className="max-w-[60%]">
            <h3 className="font-serif text-3xl text-white">{title}</h3>
            {subtitle ? <p className="mt-1 text-white/90">{subtitle}</p> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

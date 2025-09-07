"use client"

import { useState } from "react"
import Image from "next/image"
import { Facebook, Twitter, Mail, Lock, User } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  return (
    <main>
      <SiteHeader />
      <section className="relative mx-auto mt-4 w-full max-w-6xl overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1724600458551-7144f78ec0c0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHNpa2tpbSUyMHRvdXJpc218ZW58MHx8MHx8fDA%3D"
          alt="Himalayan lake background"
          width={1600}
          height={900}
          className="h-[620px] w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="w-full max-w-xl rounded-2xl border bg-white/90 p-6 shadow-xl backdrop-blur">
            <h1 className="text-center font-serif text-3xl">{mode === "signin" ? "Sign In" : "Create Account"}</h1>

            <form className="mt-6 space-y-4">
              {mode === "signup" && (
                <label className="block text-sm font-medium">
                  <span className="mb-1 block">Full Name</span>
                  <div className="flex items-center gap-2 rounded-md border bg-background px-3">
                    <User className="h-4 w-4 opacity-60" />
                    <input type="text" className="w-full bg-transparent py-2 outline-none" placeholder="Pema Lhamo" />
                  </div>
                </label>
              )}

              <label className="block text-sm font-medium">
                <span className="mb-1 block">Email Address</span>
                <div className="flex items-center gap-2 rounded-md border bg-background px-3">
                  <Mail className="h-4 w-4 opacity-60" />
                  <input
                    type="email"
                    className="w-full bg-transparent py-2 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block text-sm font-medium">
                <span className="mb-1 block">Password</span>
                <div className="flex items-center gap-2 rounded-md border bg-background px-3">
                  <Lock className="h-4 w-4 opacity-60" />
                  <input type="password" className="w-full bg-transparent py-2 outline-none" placeholder="••••••••" />
                </div>
              </label>

              {mode === "signup" && (
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" /> Subscribe to updates on tours and cultural events
                </label>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white hover:bg-indigo-700"
              >
                {mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex justify-center gap-4">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted">
                <Mail className="h-5 w-5" />
              </button>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted">
                <Twitter className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-5 text-center text-sm">
              {mode === "signin" ? (
                <>
                  New to Monastery360?{" "}
                  <button className="font-semibold text-indigo-700 hover:underline" onClick={() => setMode("signup")}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button className="font-semibold text-indigo-700 hover:underline" onClick={() => setMode("signin")}>
                    Sign in here
                  </button>
                </>
              )}
            </p>

            <div className="mt-5 border-t pt-4 text-sm">
              <p className="text-center font-semibold">What you’ll get</p>
              <ul className="mx-auto mt-2 grid max-w-md list-disc gap-1 pl-5 text-muted-foreground">
                <li>360° virtual tours of sacred monasteries</li>
                <li>Travel guides and planning resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

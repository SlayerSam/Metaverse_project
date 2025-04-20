'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to the Ultimate Experience
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Dive into an immersive world. Click below to get started.
        </p>
        <Button
          size="lg"
          className="text-lg px-6 py-4 rounded-2xl"
          onClick={() => router.push("/play")}
        >
          Play Now
        </Button>
      </div>
    </main>
  )
}

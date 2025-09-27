import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-red-900">
      <div className="text-center px-6">
        {/* Auto Audit */}
        <h1 className="text-5xl font-extrabold text--600 drop-shadow-sm">
          Auto Audit
        </h1>

        {/* Auto Audit */}
        <p className="mt-4 text-lg text-grey-700">
          Auditing Made Easy
        </p>

        {/* link to start page */}
        <div className="mt-8">
          <Link href="/template">
            <Button
  className="
    bg-white-600 
    text-white 
    font-semibold 
    px-6 
    py-3 
    rounded-lg 
    shadow-md 
    border-2 
    border-grey-700 
    transition duration-300 ease-in-out
    duration-200 
    hover:bg-neutral-100 
    hover:border-neutral-100 
    hover:shadow-lg 
    hover:scale-110
    hover:text-red-400 
  "
>
              Start
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

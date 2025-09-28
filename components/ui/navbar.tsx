"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: "/template", label: "Home" },
    { href: "/pdf-redactor", label: "PDF Redactor" },
  ]

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 shadow-md bg-white border-b">
      <Link
        href="/"
        className="text-xl text-neutral-800 font-bold hover:text-rose-600 transition-colors"
      >
        Auto Audit
      </Link>
      <div className="flex gap-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-rose-600",
              pathname === href ? "text-rose-600" : "text-gray-500"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

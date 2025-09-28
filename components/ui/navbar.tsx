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
    <nav className="flex items-center justify-between px-6 py-3 shadow-md bg-background border-b">
      <Link href="/" className="text-xl text-neutral-800 font-bold hover:text-primary transition-colors">
        Auto Audit
      </Link>
      <div className="flex gap-6">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import InteractiveGradientBackground from "@/components/ui/InteractiveGradientBackground"
import SlideSection from "@/components/templates/SlideSection"
import { Boxes } from "@/components/ui/background-boxes"

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const onScroll = () => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const winH = window.innerHeight

      const distance = winH - rect.top
      const maxDistance = rect.height * 1.5
      const clamped = Math.min(Math.max(distance, 0), maxDistance)
      const ratio = clamped / maxDistance
      setProgress(ratio)

      let newActive = -1
      sectionRefs.current.forEach((sec, i) => {
        if (sec) {
          const secRect = sec.getBoundingClientRect()
          const triggerPoint = winH * 0.5
          if (secRect.top < triggerPoint) newActive = i
        }
      })
      setActiveIndex(newActive)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const sections = [
    {
      title: "What is Auto Audit?",
      text: "Auto Audit streamlines the auditing process by automatically redacting sensitive information from PDFs. Faster, safer, smarter.",
      image: "/Templates.png",
    },
    {
      title: "How to Use",
      text: "1. Upload your PDF. 2. Select fields to redact. 3. Download your secure document. It's that simple.",
      image: "/images/audit2.svg",
    },
    {
      title: "Why it Matters",
      text: "Protecting sensitive information is critical. Auto Audit empowers individuals and organizations to maintain privacy effortlessly.",
      image: "/images/audit3.svg",
    },
  ]

  return (
    <main className="relative w-full overflow-hidden bg-rose-50 text-black">
      <InteractiveGradientBackground />

      {/* 🔴 Top Banner */}
      <div className="top-0 left-0 w-full z-50 bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-white text-sm md:text-base">
          <span className="font-medium">🚀 New Release: Auto Audit Beta is Live!</span>
          <Link
            href="/template"
            className="underline underline-offset-2 font-semibold hover:text-rose-100 transition-colors"
          >
            Try it now →
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 z-10 pt-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Boxes />
          <div className="absolute inset-0 bg-rose-50/80 z-10 pointer-events-none" />
        </div>

        <div
          className="group max-w-3xl mx-auto p-10 rounded-2xl bg-white/90 backdrop-blur-md 
                     border border-rose-300 shadow-xl transition-all duration-300 
                     hover:shadow-[0_0_40px_#f87171]/70 relative z-20"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-rose-600 group-hover:text-rose-500 transition-colors tracking-tight">
            Auto Audit
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-700 leading-relaxed">
            Your one-stop solution for <span className="text-rose-600 font-semibold">secure</span>,
            <span className="text-black font-semibold"> fast</span>, and
            <span className="text-rose-600 font-semibold"> automated</span> compliance audits and PDF redaction.
          </p>
          <div className="mt-10">
            <Link href="/template">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-10 py-5 rounded-full shadow-md hover:shadow-[0_0_25px_#f87171]/60 transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <div ref={containerRef} className="relative z-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-[-10vh] w-[4px] bg-rose-200/70 h-[140%] z-0">
          <div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-rose-400 to-rose-600 transition-[height] duration-200"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        {sections.map((sec, i) => (
          <TimelineItem
            key={i}
            index={i}
            title={sec.title}
            text={sec.text}
            image={sec.image}
            direction={i % 2 === 0 ? "left" : "right"}
            activeIndex={activeIndex}
            setRef={(el) => (sectionRefs.current[i] = el)}
          />
        ))}
      </div>

      {/* CALL TO ACTION */}
      <section className="relative py-28 bg-gradient-to-b from-rose-100 via-rose-200 to-rose-300 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-rose-700 mb-6">Ready to Protect Your Data?</h2>
          <p className="text-lg text-gray-700 mb-10">Start auditing your documents today—simple, fast, and secure.</p>
          <Link href="/template">
            <Button className="bg-rose-600 hover:bg-rose-700 text-white text-lg px-10 py-5 rounded-full shadow-md hover:shadow-[0_0_25px_#f87171]/60 transition-all duration-300 hover:scale-105">
              Start Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

function TimelineItem({
  index,
  direction,
  title,
  text,
  image,
  activeIndex,
  setRef,
}: {
  index: number
  direction: "left" | "right"
  title: string
  text: string
  image: string
  activeIndex: number
  setRef: (el: HTMLDivElement | null) => void
}) {
  const isActive = index <= activeIndex

  return (
    <section ref={setRef} className="relative w-full py-28 px-6 bg-white/90 border-t border-rose-200">
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white/80 z-10 
          transition-all duration-300 ${isActive ? "bg-rose-500 shadow-[0_0_20px_#f87171]" : "bg-rose-200/80"}`}
        style={{ top: "50%" }}
      />
      <SlideSection direction={direction}>
        <div
          className={`relative z-20 max-w-7xl mx-auto flex flex-col items-center gap-12 ${
            direction === "right" ? "md:flex-row-reverse" : "md:flex-row"
          }`}
        >
          <div className="md:w-1/2">
            <div className="group bg-white border border-rose-200 rounded-2xl p-10 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_#f87171]/70">
              <h2 className="text-4xl md:text-5xl font-bold text-rose-600 group-hover:text-rose-500 transition-colors">
                {title}
              </h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">{text}</p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={500}
              height={350}
              className="rounded-xl shadow-2xl border border-rose-200 transition-all duration-300 hover:shadow-[0_0_25px_#f87171]/60"
            />
          </div>
        </div>
      </SlideSection>
    </section>
  )
}

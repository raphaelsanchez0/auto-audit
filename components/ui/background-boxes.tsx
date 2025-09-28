"use client"
import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(150).fill(1) // Grid rows
  const cols = new Array(100).fill(1) // Grid columns

  const colors = [
    "rgba(248, 113, 113, 0.8)",
    "rgba(251, 113, 133, 0.8)",
    "rgba(244, 63, 94, 0.8)",
    "rgba(236, 72, 153, 0.8)",
    "rgba(225, 29, 72, 0.8)",
    "rgba(190, 24, 93, 0.8)",
    "rgba(252, 165, 165, 0.8)",
    "rgba(249, 168, 212, 0.8)",
  ]

  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div key={`row-${i}`} className="relative h-8 w-16 border-l border-slate-700">
          {cols.map((_, j) => (
            <motion.div
              key={`col-${i}-${j}`}
              initial={{ backgroundColor: "transparent", scale: 1 }}
              whileHover={{
                backgroundColor: getRandomColor(),
                scale: 1.15,
                boxShadow: "0 0 15px rgba(255,0,0,0.5)",
                transition: { duration: 0.1 }, // Quick hover effect
              }}
              animate={{
                backgroundColor: "transparent",
                scale: 1,
                transition: { duration: 1.2, ease: "easeOut" }, // Lingering fade out
              }}
              className="relative h-8 w-16 border-t border-r border-slate-700 cursor-pointer"
              style={{ pointerEvents: "auto", transformOrigin: "center" }}
            >
              {j % 2 === 0 && i % 2 === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const Boxes = React.memo(BoxesCore)

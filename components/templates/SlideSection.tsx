"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SlideSection({
  direction = "left",
  children,
}: {
  direction?: "left" | "right";
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // start when bottom hits viewport bottom
  });

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [direction === "left" ? -150 : 150, 0, direction === "left" ? -150 : 150]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ x, opacity }}
      transition={{ type: "spring", stiffness: 60, damping: 20 }}
      className="w-full"
    >
      {children}
    </motion.section>
  );
}

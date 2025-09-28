"use client";

import { useEffect, useState } from "react";

export default function InteractiveGradientBackground() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `
          linear-gradient(180deg, rgba(200,0,0,0.3), rgba(50,0,0,0.8))
        `,
        transition: "background 0.1s ease",
      }}
    />
  );
}

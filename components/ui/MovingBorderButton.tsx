"use client";

import React, { ButtonHTMLAttributes } from "react";

interface MovingBorderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function MovingBorderButton({ children, className = "", ...props }: MovingBorderButtonProps) {
  return (
    <button
      {...props}
      className={`
        relative inline-block px-6 py-3 font-semibold rounded-lg text-white
        overflow-hidden transition-all duration-300
        bg-red-700 hover:bg-red-800
        ${className}
      `}
    >
      {/* Moving border */}
      <span className="absolute inset-0 border-2 border-red-400 rounded-lg animate-border pointer-events-none"></span>
      
      {/* Button text */}
      <span className="relative z-10">{children}</span>

      <style jsx>{`
        @keyframes borderMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-border {
          border-image: linear-gradient(90deg, #ff0000, #ff8080, #ff0000);
          border-image-slice: 1;
          animation: borderMove 3s linear infinite;
        }
      `}</style>
    </button>
  );
}

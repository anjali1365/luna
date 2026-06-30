"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
}: {
  className?: string;
  children?: ReactNode;
  showRadialGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none z-0",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-60 dark:opacity-80 will-change-transform",
          "mix-blend-normal dark:mix-blend-screen transition-opacity duration-1000",
          showRadialGradient &&
            "[mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]"
        )}
      >
        {/* Animated Aurora Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: ["0%", "5%", "0%"],
            y: ["0%", "-5%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-brand-300/40 dark:bg-brand-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: ["0%", "-8%", "0%"],
            y: ["0%", "8%", "0%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vh] rounded-full bg-indigo-300/40 dark:bg-purple-800/30 blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            x: ["0%", "6%", "0%"],
            y: ["0%", "6%", "0%"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-[20%] left-[20%] w-[50vw] h-[50vh] rounded-full bg-pink-300/30 dark:bg-rose-900/20 blur-[100px]"
        />
      </div>
      {children}
    </div>
  );
};

"use client";

import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  transparentOnMobile?: boolean;
}

export const GlowCard = ({
  children,
  className,
  glowColor = "rgba(99, 102, 241, 0.4)", // Brand-500 with opacity
  transparentOnMobile = false,
  ...props
}: GlowCardProps) => {
  return (
    <div
      className={cn(
        "relative rounded-[2rem] lg:rounded-[2.5rem] p-[1px] overflow-hidden group",
        className
      )}
      {...props}
    >
      {/* Static subtle hover glow */}
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,var(--glow-color)_0%,transparent_100%)]"
        style={{ "--glow-color": glowColor } as CSSProperties}
      />

      {/* Inner glass layer to mask the middle of the conic gradient */}
      <div className={cn(
        "absolute inset-[1px] rounded-[calc(2rem-1px)] lg:rounded-[calc(2.5rem-1px)] z-0 transition-colors duration-500",
        transparentOnMobile ? "hidden lg:block bg-transparent lg:bg-white/40 dark:lg:bg-slate-950/60 lg:backdrop-blur-3xl" : "bg-white/40 dark:bg-slate-950/60 backdrop-blur-3xl"
      )} />

      {/* A static subtle border overlay just in case */}
      <div className={cn(
        "absolute inset-[1px] rounded-[calc(2rem-1px)] lg:rounded-[calc(2.5rem-1px)] z-0",
        transparentOnMobile ? "hidden lg:block border border-white/50 dark:border-slate-700/30" : "border border-white/50 dark:border-slate-700/30"
      )} />

      <div className="relative z-10 w-full h-full flex flex-col rounded-[calc(2rem-1px)] lg:rounded-[calc(2.5rem-1px)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

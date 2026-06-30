"use client";

import React, { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  blinkRate: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  dx: number;
  dy: number;
}

export const StarsBackground = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((window.innerWidth * window.innerHeight) / 4500);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1, // Slightly larger to show the shape
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          opacity: Math.random(),
          blinkRate: Math.random() * 0.005 + 0.002,
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We check if dark mode is active by looking at the html class
      const isDark = document.documentElement.classList.contains('dark');

      stars.forEach((star) => {
        // Subtle drift
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Blinking effect
        star.opacity += star.blinkRate;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.blinkRate = -star.blinkRate;
        }

        // Draw a sharp 4-point star instead of a circle
        ctx.beginPath();
        const r = star.radius;
        const innerR = r * 0.25; // How sharp the star is
        ctx.moveTo(star.x, star.y - r); // Top
        ctx.lineTo(star.x + innerR, star.y - innerR);
        ctx.lineTo(star.x + r, star.y); // Right
        ctx.lineTo(star.x + innerR, star.y + innerR);
        ctx.lineTo(star.x, star.y + r); // Bottom
        ctx.lineTo(star.x - innerR, star.y + innerR);
        ctx.lineTo(star.x - r, star.y); // Left
        ctx.lineTo(star.x - innerR, star.y - innerR);
        ctx.closePath();
        
        // Dark mode: white stars. Light mode: indigo/blue stars
        const baseColor = isDark ? "255, 255, 255" : "99, 102, 241"; 
        
        ctx.fillStyle = `rgba(${baseColor}, ${star.opacity})`;
        ctx.fill();
        
        // Add a sharper glow
        ctx.shadowBlur = isDark ? 6 : 3;
        ctx.shadowColor = `rgba(${baseColor}, ${star.opacity})`;
      });

      // --- Shooting Stars Logic ---
      if (Math.random() < 0.005 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * canvas.width * 1.5,
          y: -50,
          length: Math.random() * 30 + 15, // Shorter tail
          speed: Math.random() * 15 + 15,
          opacity: 1,
          dx: -1, 
          dy: 1,  
        });
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.dx * ss.speed;
        ss.y += ss.dy * ss.speed;
        ss.opacity -= 0.04; // Fades out faster so it doesn't travel too far

        if (ss.opacity <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.dx * ss.length, ss.y - ss.dy * ss.length);
        
        const ssBaseColor = isDark ? "255, 255, 255" : "99, 102, 241";
        const gradient = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.dx * ss.length, ss.y - ss.dy * ss.length);
        gradient.addColorStop(0, `rgba(${ssBaseColor}, ${ss.opacity})`);
        gradient.addColorStop(1, `rgba(${ssBaseColor}, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = isDark ? 10 : 4;
        ctx.shadowColor = `rgba(${ssBaseColor}, ${ss.opacity})`;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(drawStars);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 bg-bg-base dark:bg-[#05050A] transition-colors duration-1000 ${className}`}>
      {/* Subtle radial gradient for depth, removing the noisy blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/10 dark:to-black/40" />
      
      {/* Canvas for Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60 dark:opacity-100" />
    </div>
  );
};

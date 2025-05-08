"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Inicializar partículas
  const initParticles = () => {
    if (!canvasRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width, height });

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor(width * height * 0.0001), 100);

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: isDark
          ? `rgba(${6 + Math.random() * 30}, ${182 + Math.random() * 30}, ${
              212 + Math.random() * 30
            }, ${0.3 + Math.random() * 0.3})`
          : `rgba(${6 + Math.random() * 30}, ${182 + Math.random() * 30}, ${
              212 + Math.random() * 30
            }, ${0.2 + Math.random() * 0.2})`,
      });
    }

    particlesRef.current = particles;
  };

  // Animar partículas
  const animateParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    particlesRef.current.forEach((particle) => {
      // Actualizar posición
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Rebote en los bordes
      if (particle.x > dimensions.width || particle.x < 0) {
        particle.speedX = -particle.speedX;
      }
      if (particle.y > dimensions.height || particle.y < 0) {
        particle.speedY = -particle.speedY;
      }

      // Dibujar partícula
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
    });

    // Dibujar conexiones
    ctx.strokeStyle = isDark
      ? "rgba(6, 182, 212, 0.1)"
      : "rgba(6, 182, 212, 0.05)";
    ctx.lineWidth = 0.5;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const dx = particlesRef.current[i].x - particlesRef.current[j].x;
        const dy = particlesRef.current[i].y - particlesRef.current[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
          ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
          ctx.stroke();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  // Efecto para inicializar y limpiar
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initParticles();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    animationRef.current = requestAnimationFrame(animateParticles);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Actualizar colores cuando cambia el tema
  useEffect(() => {
    if (particlesRef.current.length > 0) {
      particlesRef.current = particlesRef.current.map((particle) => ({
        ...particle,
        color: isDark
          ? `rgba(${6 + Math.random() * 30}, ${182 + Math.random() * 30}, ${
              212 + Math.random() * 30
            }, ${0.3 + Math.random() * 0.3})`
          : `rgba(${6 + Math.random() * 30}, ${182 + Math.random() * 30}, ${
              212 + Math.random() * 30
            }, ${0.2 + Math.random() * 0.2})`,
      }));
    }
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-70 dark:opacity-40"
      width={dimensions.width}
      height={dimensions.height}
    />
  );
}

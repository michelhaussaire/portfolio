"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

export function CursorLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const animationRef = useRef<number | undefined>(undefined);
  const isMoving = useRef<boolean>(false);
  const lastMoveTime = useRef<number>(0);

  // Resize handler with debounce
  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      setDimensions({ width, height });
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    handleResize();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(handleResize);
    if (canvasRef.current) {
      resizeObserver.observe(document.body);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize]);

  // Optimized mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse movement updates
      const now = performance.now();
      if (now - lastMoveTime.current > 10) {
        // Update every 10ms max
        setMousePosition({ x: e.clientX, y: e.clientY });
        isMoving.current = true;
        lastMoveTime.current = now;

        // Reset moving state after a delay
        setTimeout(() => {
          isMoving.current = false;
        }, 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Draw light effect with optimizations
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let opacity = 1;
    let radius = isDark ? 300 : 250;
    let centerSize = isDark ? 50 : 40;

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Adjust radius based on movement
      const targetRadius = isDark
        ? isMoving.current
          ? 350
          : 300
        : isMoving.current
        ? 300
        : 250;

      radius += (targetRadius - radius) * 0.1;

      // Adjust center glow size
      const targetCenterSize = isDark
        ? isMoving.current
          ? 60
          : 50
        : isMoving.current
        ? 50
        : 40;

      centerSize += (targetCenterSize - centerSize) * 0.1;

      // Create radial gradient for the light effect
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        radius
      );

      // Colors based on theme with improved opacity
      const maxOpacity = isMoving.current
        ? isDark
          ? 0.18
          : 0.12
        : isDark
        ? 0.15
        : 0.1;

      if (isDark) {
        gradient.addColorStop(0, `rgba(6, 182, 212, ${maxOpacity})`);
        gradient.addColorStop(0.2, `rgba(6, 182, 212, ${maxOpacity * 0.6})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${maxOpacity * 0.3})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        gradient.addColorStop(0, `rgba(6, 182, 212, ${maxOpacity * 0.7})`);
        gradient.addColorStop(0.2, `rgba(6, 182, 212, ${maxOpacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${maxOpacity * 0.2})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      // Draw the gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Enhanced center glow
      const centerGlow = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        centerSize
      );

      const centerOpacity = isMoving.current
        ? isDark
          ? 0.25
          : 0.18
        : isDark
        ? 0.2
        : 0.15;

      centerGlow.addColorStop(0, `rgba(6, 182, 212, ${centerOpacity})`);
      centerGlow.addColorStop(0.5, `rgba(6, 182, 212, ${centerOpacity * 0.5})`);
      centerGlow.addColorStop(1, "rgba(6, 182, 212, 0)");

      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, dimensions, isDark]);

  // Only render if we're in the browser
  if (typeof window === "undefined") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

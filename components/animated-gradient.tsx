"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Colores para el gradiente
    const colors = {
      light: [
        { r: 239, g: 246, b: 255, a: 0.2 }, // blue-50
        { r: 236, g: 254, b: 255, a: 0.2 }, // cyan-50
        { r: 240, g: 249, b: 255, a: 0.2 }, // sky-50
      ],
      dark: [
        { r: 3, g: 7, b: 18, a: 0.3 }, // slate-950
        { r: 8, g: 47, b: 73, a: 0.3 }, // cyan-950
        { r: 12, g: 74, b: 110, a: 0.3 }, // blue-900
      ],
    }

    const gradientColors = isDark ? colors.dark : colors.light

    // Crear círculos de gradiente
    const circles = [
      {
        x: width * 0.3,
        y: height * 0.3,
        radius: Math.max(width, height) * 0.3,
        color: gradientColors[0],
      },
      {
        x: width * 0.7,
        y: height * 0.7,
        radius: Math.max(width, height) * 0.3,
        color: gradientColors[1],
      },
      {
        x: width * 0.5,
        y: height * 0.5,
        radius: Math.max(width, height) * 0.4,
        color: gradientColors[2],
      },
    ]

    // Animar gradiente
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // Actualizar posiciones con movimiento suave
      const time = Date.now() * 0.001
      circles[0].x = width * 0.3 + Math.sin(time * 0.3) * width * 0.1
      circles[0].y = height * 0.3 + Math.cos(time * 0.2) * height * 0.1
      circles[1].x = width * 0.7 + Math.sin(time * 0.2) * width * 0.1
      circles[1].y = height * 0.7 + Math.cos(time * 0.3) * height * 0.1

      // Dibujar círculos con gradiente
      circles.forEach((circle) => {
        const gradient = ctx.createRadialGradient(circle.x, circle.y, 0, circle.x, circle.y, circle.radius)
        gradient.addColorStop(0, `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, ${circle.color.a})`)
        gradient.addColorStop(1, `rgba(${circle.color.r}, ${circle.color.g}, ${circle.color.b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

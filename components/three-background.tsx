"use client"

import React from "react"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import type * as THREE from "three"

// Componente para una esfera flotante con efecto neón
function NeonSphere({ position, size, color, speed, amplitude }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Posición inicial
  const initialY = position[1]

  // Animación de flotación
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Movimiento ondulatorio
    meshRef.current.position.y = initialY + Math.sin(time * speed) * amplitude

    // Rotación suave
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.z = time * 0.1
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={isDark ? color.dark : color.light}
        emissive={isDark ? color.dark : color.light}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// Componente para un cubo flotante con efecto neón
function NeonCube({ position, size, color, speed, amplitude, rotationSpeed }: any) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Posición inicial
  const initialY = position[1]

  // Animación de flotación
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // Movimiento ondulatorio
    meshRef.current.position.y = initialY + Math.sin(time * speed) * amplitude

    // Rotación suave
    meshRef.current.rotation.x = time * rotationSpeed.x
    meshRef.current.rotation.y = time * rotationSpeed.y
    meshRef.current.rotation.z = time * rotationSpeed.z
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={isDark ? color.dark : color.light}
        emissive={isDark ? color.dark : color.light}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

// Escena principal con todos los elementos 3D
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Esferas neón */}
      <NeonSphere
        position={[-4, 2, -5]}
        size={0.5}
        color={{ light: "#06b6d4", dark: "#22d3ee" }}
        speed={0.5}
        amplitude={0.3}
      />
      <NeonSphere
        position={[5, -2, -7]}
        size={0.7}
        color={{ light: "#0ea5e9", dark: "#38bdf8" }}
        speed={0.3}
        amplitude={0.5}
      />

      {/* Cubos neón */}
      <NeonCube
        position={[3, 3, -6]}
        size={0.6}
        color={{ light: "#0891b2", dark: "#06b6d4" }}
        speed={0.4}
        amplitude={0.4}
        rotationSpeed={{ x: 0.01, y: 0.02, z: 0.01 }}
      />
      <NeonCube
        position={[-3, -3, -8]}
        size={0.8}
        color={{ light: "#2563eb", dark: "#3b82f6" }}
        speed={0.2}
        amplitude={0.6}
        rotationSpeed={{ x: 0.02, y: 0.01, z: 0.03 }}
      />
    </>
  )
}

// Componente de fallback para cuando Three.js no carga correctamente
function FallbackBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-70 dark:opacity-40">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-cyan-50/20 to-blue-50/30 dark:from-blue-950/30 dark:via-cyan-950/20 dark:to-blue-950/30"></div>
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-cyan-300/20 dark:bg-cyan-500/10 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-blue-300/20 dark:bg-blue-500/10 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-cyan-400/20 dark:bg-cyan-400/10 blur-2xl"></div>
    </div>
  )
}

export function ThreeBackground() {
  const [isClient, setIsClient] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || hasError) {
    return <FallbackBackground />
  }

  return (
    <div className="fixed inset-0 -z-10 opacity-70 dark:opacity-40">
      <ErrorBoundary fallback={<FallbackBackground />} onError={() => setHasError(true)}>
        <Suspense fallback={<FallbackBackground />}>
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Scene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Componente para manejar errores en Three.js
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

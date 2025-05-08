"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Float, Preload } from "@react-three/drei"
import { useTheme } from "next-themes"
import { Color, type Mesh, type MeshStandardMaterial } from "three"

function FloatingText({ text, position, color, size, rotation, speed }: any) {
  const textRef = useRef<Mesh>(null!)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    textRef.current.rotation.y = Math.sin(time * speed) * 0.1 + rotation.y
    textRef.current.rotation.x = Math.sin(time * speed * 0.5) * 0.05 + rotation.x
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        ref={textRef}
        position={position}
        fontSize={size}
        color={isDark ? color.dark : color.light}
        font="/fonts/inter-bold.woff"
        maxWidth={2}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </Float>
  )
}

function FloatingSkill({ text, position, color, size, speed, amplitude }: any) {
  const textRef = useRef<Mesh>(null!)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Posición inicial
  const initialY = position[1]

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    textRef.current.position.y = initialY + Math.sin(time * speed) * amplitude
    textRef.current.rotation.z = Math.sin(time * speed * 0.5) * 0.1
  })

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={size}
      color={isDark ? color.dark : color.light}
      font="/fonts/inter-medium.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}

function NeonRing({ position, radius, tubeRadius, color, rotationSpeed }: any) {
  const ringRef = useRef<Mesh>(null!)
  const materialRef = useRef<MeshStandardMaterial>(null!)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    ringRef.current.rotation.x = time * rotationSpeed.x
    ringRef.current.rotation.y = time * rotationSpeed.y
    ringRef.current.rotation.z = time * rotationSpeed.z

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(time) * 0.2
    }
  })

  // Colores según el tema
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color = new Color(isDark ? color.dark : color.light)
      materialRef.current.emissive = new Color(isDark ? color.dark : color.light)
    }
  }, [isDark, color])

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[radius, tubeRadius, 16, 100]} />
      <meshStandardMaterial
        ref={materialRef}
        color={isDark ? color.dark : color.light}
        emissive={isDark ? color.dark : color.light}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />

      {/* Texto principal flotante */}
      <FloatingText
        text="Jane Doe"
        position={[0, 0.5, 0]}
        color={{ light: "#0ea5e9", dark: "#22d3ee" }}
        size={0.5}
        rotation={{ x: 0, y: 0, z: 0 }}
        speed={0.5}
      />

      <FloatingText
        text="Full Stack Developer"
        position={[0, -0.2, 0]}
        color={{ light: "#0891b2", dark: "#06b6d4" }}
        size={0.2}
        rotation={{ x: 0, y: 0, z: 0 }}
        speed={0.3}
      />

      {/* Habilidades flotantes */}
      <FloatingSkill
        text="React"
        position={[-2, 1.5, -1]}
        color={{ light: "#0ea5e9", dark: "#38bdf8" }}
        size={0.15}
        speed={0.4}
        amplitude={0.1}
      />

      <FloatingSkill
        text="Next.js"
        position={[2, 1.3, -1]}
        color={{ light: "#0ea5e9", dark: "#38bdf8" }}
        size={0.15}
        speed={0.5}
        amplitude={0.15}
      />

      <FloatingSkill
        text="TypeScript"
        position={[-1.5, -1.5, -1]}
        color={{ light: "#0ea5e9", dark: "#38bdf8" }}
        size={0.15}
        speed={0.3}
        amplitude={0.12}
      />

      <FloatingSkill
        text="Node.js"
        position={[1.5, -1.3, -1]}
        color={{ light: "#0ea5e9", dark: "#38bdf8" }}
        size={0.15}
        speed={0.45}
        amplitude={0.08}
      />

      {/* Anillos neón */}
      <NeonRing
        position={[0, 0, -2]}
        radius={2}
        tubeRadius={0.02}
        color={{ light: "#0ea5e9", dark: "#22d3ee" }}
        rotationSpeed={{ x: 0.001, y: 0.002, z: 0.001 }}
      />

      <NeonRing
        position={[0, 0, -2]}
        radius={2.5}
        tubeRadius={0.01}
        color={{ light: "#2563eb", dark: "#3b82f6" }}
        rotationSpeed={{ x: -0.001, y: 0.001, z: 0.002 }}
      />

      <Preload all />
    </>
  )
}

export function ThreeHero() {
  return (
    <div className="absolute inset-0 -z-5">
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  )
}

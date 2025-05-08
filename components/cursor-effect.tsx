"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: string;
  gravity: number;
  friction: number;
  type: "dust" | "spark" | "trail";
}

interface TrailPoint {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  speed: number;
}

export function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [prevMousePosition, setPrevMousePosition] = useState({
    x: -100,
    y: -100,
  });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const particlesRef = useRef<Particle[]>([]);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const lastTrailTimeRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const animationRef = useRef<number | undefined>(undefined);
  const moveTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // Define functions with useCallback
  // Añadir punto a la estela
  const addTrailPoint = useCallback(
    (x: number, y: number) => {
      const maxAge = 25; // Duración de los puntos de la estela
      trailPointsRef.current.push({
        x,
        y,
        age: 0,
        maxAge,
        speed: mouseSpeed, // Guardar la velocidad actual para cada punto
      });

      // Limitar el número de puntos para optimización
      if (trailPointsRef.current.length > 25) {
        // Aumentado para mejores curvas
        trailPointsRef.current = trailPointsRef.current.slice(-25);
      }
    },
    [mouseSpeed]
  );

  // Crear partículas
  const createParticles = useCallback(() => {
    if (!isMoving) return;

    // Calcular velocidad del movimiento
    const dx = mousePosition.x - prevMousePosition.x;
    const dy = mousePosition.y - prevMousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Solo crear partículas si hay suficiente movimiento
    if (distance < 5) return;

    // Número de partículas basado en la velocidad (limitado para optimización)
    const particleCount = Math.min(Math.floor(mouseSpeed / 5), 5);

    for (let i = 0; i < particleCount; i++) {
      // Determinar tipo de partícula
      const particleTypes: ("dust" | "spark" | "trail")[] = [
        "dust",
        "spark",
        "trail",
      ];
      const type =
        particleTypes[Math.floor(Math.random() * particleTypes.length)];

      // Configurar propiedades según el tipo
      let size, maxLife, gravity, friction, colorBase;

      switch (type) {
        case "dust":
          size = Math.max(1, Math.random() * 2);
          maxLife = Math.max(10, Math.random() * 20 + 10);
          gravity = 0.01 * (Math.random() - 0.5);
          friction = 0.98;
          colorBase = isDark ? [6, 182, 212] : [6, 182, 212];
          break;
        case "spark":
          size = Math.max(0.5, Math.random() * 1.5);
          maxLife = Math.max(15, Math.random() * 25 + 15);
          gravity = 0.02 * (Math.random() - 0.5);
          friction = 0.96;
          colorBase = isDark ? [59, 130, 246] : [59, 130, 246];
          break;
        case "trail":
          size = Math.max(1.5, Math.random() * 2.5);
          maxLife = Math.max(8, Math.random() * 15 + 5);
          gravity = 0.005 * (Math.random() - 0.5);
          friction = 0.99;
          colorBase = isDark ? [14, 165, 233] : [14, 165, 233];
          break;
      }

      // Añadir variación al color
      const colorVariation = 30;
      const r =
        colorBase[0] + Math.random() * colorVariation - colorVariation / 2;
      const g =
        colorBase[1] + Math.random() * colorVariation - colorVariation / 2;
      const b =
        colorBase[2] + Math.random() * colorVariation - colorVariation / 2;

      // Opacidad según el tema y tipo
      const opacity = isDark
        ? (type === "spark" ? 0.3 : 0.2) + Math.random() * 0.3
        : (type === "spark" ? 0.2 : 0.1) + Math.random() * 0.2;

      // Posición ligeramente aleatoria alrededor del cursor
      const spread = type === "spark" ? 15 : 10;
      const x = mousePosition.x + (Math.random() - 0.5) * spread;
      const y = mousePosition.y + (Math.random() - 0.5) * spread;

      // Velocidad basada en el movimiento del cursor pero con aleatoriedad
      const speedFactor = type === "spark" ? 0.7 : 0.5;
      const speedX =
        (dx / 10) * (Math.random() * speedFactor + 0.2) +
        (Math.random() - 0.5) * 0.5;
      const speedY =
        (dy / 10) * (Math.random() * speedFactor + 0.2) +
        (Math.random() - 0.5) * 0.5;

      // Color según el tema y tipo
      const color = `rgba(${r}, ${g}, ${b}, ${opacity})`;

      particlesRef.current.push({
        x,
        y,
        size,
        speedX,
        speedY,
        life: maxLife,
        maxLife,
        color,
        gravity,
        friction,
        type,
      });
    }

    // Limitar el número total de partículas para optimización
    if (particlesRef.current.length > 100) {
      particlesRef.current = particlesRef.current.slice(-100);
    }
  }, [mousePosition, prevMousePosition, mouseSpeed, isMoving, isDark]);

  // Actualizar y dibujar partículas
  const updateParticles = (ctx: CanvasRenderingContext2D) => {
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Aplicar física
      particle.speedX *= particle.friction;
      particle.speedY *= particle.friction;
      particle.speedY += particle.gravity;

      // Actualizar posición
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Reducir vida
      particle.life -= 1;

      // Calcular opacidad basada en vida restante
      const opacity = Math.max(0, particle.life / particle.maxLife);

      // Calcular tamaño basado en tipo y vida
      let size = particle.size;
      if (particle.type === "spark") {
        // Las chispas se hacen más pequeñas al final de su vida
        size *= opacity;
      } else if (particle.type === "trail") {
        // La estela se hace más grande al principio y luego se reduce
        const lifeRatio = particle.life / particle.maxLife;
        size *= lifeRatio < 0.5 ? lifeRatio * 2 : (1 - lifeRatio) * 2;
      }

      // Solo dibujar si la opacidad y el tamaño son positivos
      if (opacity > 0 && size > 0) {
        // Dibujar partícula con opacidad decreciente
        const color = particle.color.replace(/[\d.]+\)$/, `${opacity})`);
        ctx.fillStyle = color;

        if (particle.type === "spark") {
          // Las chispas tienen un brillo adicional
          ctx.shadowBlur = 5;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        // Asegurar que el radio sea siempre positivo
        const radius = Math.max(0.1, size);
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Resetear sombra
        ctx.shadowBlur = 0;
      }

      // Mantener partícula si aún tiene vida
      return particle.life > 0;
    });
  };

  // Actualizar y dibujar estela
  const updateTrail = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      // Actualizar edad de los puntos
      trailPointsRef.current = trailPointsRef.current.filter((point) => {
        point.age += 1;
        return point.age < point.maxAge;
      });

      // Si no hay suficientes puntos, no dibujar
      if (trailPointsRef.current.length < 2) return;

      // Dibujar línea conectando los puntos usando curvas más suaves
      ctx.beginPath();

      // Función para calcular puntos intermedios para curvas más suaves
      const getSplinePoints = (
        points: TrailPoint[],
        tension = 0.35
      ): [number, number][] => {
        if (points.length < 2) return points.map((p) => [p.x, p.y]);

        const result: [number, number][] = [];

        // Añadir el primer punto
        result.push([points[0].x, points[0].y]);

        // Calcular puntos de control para cada segmento
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = i > 0 ? points[i - 1] : points[i];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = i < points.length - 2 ? points[i + 2] : p2;

          // Calcular puntos de la curva
          const cp1x = p1.x + (p2.x - p0.x) * tension;
          const cp1y = p1.y + (p2.y - p0.y) * tension;
          const cp2x = p2.x - (p3.x - p1.x) * tension;
          const cp2y = p2.y - (p3.y - p1.y) * tension;

          // Añadir puntos de control y punto final
          result.push([cp1x, cp1y], [cp2x, cp2y], [p2.x, p2.y]);
        }

        return result;
      };

      // Obtener puntos para la curva suavizada
      const splinePoints = getSplinePoints(trailPointsRef.current);

      // Dibujar la curva
      if (splinePoints.length >= 4) {
        // Necesitamos al menos 4 puntos para una curva cúbica
        ctx.moveTo(splinePoints[0][0], splinePoints[0][1]);

        // Dibujar curvas cúbicas de Bezier
        for (let i = 1; i < splinePoints.length - 2; i += 3) {
          ctx.bezierCurveTo(
            splinePoints[i][0],
            splinePoints[i][1],
            splinePoints[i + 1][0],
            splinePoints[i + 1][1],
            splinePoints[i + 2][0],
            splinePoints[i + 2][1]
          );
        }
      }

      // Configurar estilo de línea con grosor variable basado en la velocidad
      const maxLineWidth = isDark ? 2.5 : 2;
      const minLineWidth = isDark ? 1 : 0.75;

      // Configurar estilo de línea
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Crear un gradiente para el trazo que varía según la velocidad
      const gradient = ctx.createLinearGradient(
        trailPointsRef.current[0].x,
        trailPointsRef.current[0].y,
        trailPointsRef.current[trailPointsRef.current.length - 1].x,
        trailPointsRef.current[trailPointsRef.current.length - 1].y
      );

      // Colores según el tema, mejorados para mayor visibilidad
      if (isDark) {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0)");
        gradient.addColorStop(0.3, "rgba(6, 182, 212, 0.15)");
        gradient.addColorStop(0.7, "rgba(6, 182, 212, 0.25)");
        gradient.addColorStop(1, "rgba(6, 182, 212, 0.35)");
      } else {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0)");
        gradient.addColorStop(0.3, "rgba(6, 182, 212, 0.1)");
        gradient.addColorStop(0.7, "rgba(6, 182, 212, 0.15)");
        gradient.addColorStop(1, "rgba(6, 182, 212, 0.25)");
      }

      ctx.strokeStyle = gradient;

      // Aplicar anchura de línea variable para puntos con diferentes velocidades
      for (let i = 0; i < trailPointsRef.current.length - 1; i++) {
        const point = trailPointsRef.current[i];
        const nextPoint = trailPointsRef.current[i + 1];

        // Calcular ancho basado en velocidad y edad
        const speedFactor = Math.min(1, point.speed / 50);
        const ageFactor = 1 - point.age / point.maxAge;
        const lineWidth =
          minLineWidth +
          (maxLineWidth - minLineWidth) * speedFactor * ageFactor;

        // Crear un path separado para cada segmento para aplicar ancho variable
        if (i < trailPointsRef.current.length - 2) {
          ctx.beginPath();
          ctx.lineWidth = lineWidth;

          // Usar los puntos de control calculados previamente
          const idx = i * 3;
          if (idx + 3 < splinePoints.length) {
            ctx.moveTo(splinePoints[idx][0], splinePoints[idx][1]);
            ctx.bezierCurveTo(
              splinePoints[idx + 1][0],
              splinePoints[idx + 1][1],
              splinePoints[idx + 2][0],
              splinePoints[idx + 2][1],
              splinePoints[idx + 3][0],
              splinePoints[idx + 3][1]
            );
            ctx.stroke();
          }
        }
      }
    },
    [isDark]
  );

  // Inicializar canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Seguir al cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Update mouse position
      setMousePosition({ x: mouseX, y: mouseY });

      // Calculate mouse speed
      const dx = mouseX - prevMousePosition.x;
      const dy = mouseY - prevMousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.min(Math.max(distance, 0), 75);
      setMouseSpeed(speed);

      // Add point to the trail if there is movement
      if (distance > 5) {
        addTrailPoint(mouseX, mouseY);
        setPrevMousePosition({ x: mouseX, y: mouseY });
        setIsMoving(true);

        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current);
        }

        // Reset movement detection after a delay
        moveTimeout.current = setTimeout(() => {
          setIsMoving(false);
        }, 100);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const now = performance.now();
        const oldPos = { ...mousePosition };
        const newPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        // Calcular velocidad del movimiento
        const dx = newPos.x - oldPos.x;
        const dy = newPos.y - oldPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDelta = now - lastTrailTimeRef.current;
        const speed = (distance / Math.max(1, timeDelta)) * 16; // Normalizar a ~60fps

        setPrevMousePosition(oldPos);
        setMousePosition(newPos);
        setMouseSpeed(speed);
        setIsMoving(true);

        // Añadir punto a la estela si ha pasado suficiente tiempo
        if (now - lastTrailTimeRef.current > 16) {
          // ~60fps
          addTrailPoint(newPos.x, newPos.y);
          lastTrailTimeRef.current = now;
        }

        // Resetear el timeout si existe
        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current);
        }

        // Establecer un nuevo timeout
        moveTimeout.current = setTimeout(() => {
          setIsMoving(false);
        }, 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current);
      }
    };
  }, [mousePosition, prevMousePosition, addTrailPoint]);

  // Dibujar efecto de luz
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Dibujar estela
      updateTrail(ctx);

      // Crear partículas si el cursor se está moviendo
      createParticles();

      // Actualizar y dibujar partículas existentes
      updateParticles(ctx);

      // Crear gradiente radial para el efecto de luz (más sutil)
      const gradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        isDark ? 150 : 120
      );

      // Colores según el tema (más sutiles)
      if (isDark) {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0.08)"); // Cyan más sutil en el centro
        gradient.addColorStop(0.3, "rgba(6, 182, 212, 0.04)");
        gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.02)"); // Azul en los bordes
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0.05)"); // Cyan más sutil en el centro
        gradient.addColorStop(0.3, "rgba(6, 182, 212, 0.03)");
        gradient.addColorStop(0.6, "rgba(59, 130, 246, 0.01)"); // Azul en los bordes
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      }

      // Dibujar el gradiente
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Efecto de brillo adicional en el centro (más sutil)
      const centerGlow = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        isDark ? 30 : 25
      );

      if (isDark) {
        centerGlow.addColorStop(0, "rgba(6, 182, 212, 0.1)");
        centerGlow.addColorStop(1, "rgba(6, 182, 212, 0)");
      } else {
        centerGlow.addColorStop(0, "rgba(6, 182, 212, 0.07)");
        centerGlow.addColorStop(1, "rgba(6, 182, 212, 0)");
      }

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
  }, [
    mousePosition,
    prevMousePosition,
    dimensions,
    isDark,
    isMoving,
    mouseSpeed,
    createParticles,
    updateTrail,
  ]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
}

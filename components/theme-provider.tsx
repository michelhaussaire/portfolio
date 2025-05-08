"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Verificar localStorage al inicio para establecer el tema
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme-preference")
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme === "dark" ? "dark" : "light")
      document.documentElement.classList.remove(savedTheme === "dark" ? "light" : "dark")
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"

type Theme = "light" | "dark" | "vibrant" | "professional"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  theme: initialTheme,
  setTheme: setInitialTheme,
}: {
  children: React.ReactNode
  theme: Theme
  setTheme: (theme: Theme) => void
}) {
  useEffect(() => {
    const root = document.documentElement
    root.className = initialTheme === "dark" || initialTheme === "vibrant" ? "dark" : ""
    root.setAttribute("data-theme", initialTheme)
  }, [initialTheme])

  return (
    <ThemeContext.Provider value={{ theme: initialTheme, setTheme: setInitialTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

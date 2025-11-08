"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface ThemeSwitcherProps {
  currentTheme: string
  setTheme: (theme: string) => void
}

const themes = [
  { id: "light", label: "Light", description: "Clean & bright" },
  { id: "dark", label: "Dark", description: "Easy on the eyes" },
  { id: "vibrant", label: "Vibrant", description: "Bold & colorful" },
  { id: "professional", label: "Professional", description: "Corporate style" },
]

export default function ThemeSwitcher({ currentTheme, setTheme }: ThemeSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          🎨
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="flex flex-col items-start gap-1 cursor-pointer"
          >
            <div className="flex items-center gap-2 w-full">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  currentTheme === theme.id ? "border-primary bg-primary" : "border-border"
                }`}
              />
              <span className="font-medium">{theme.label}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-6">{theme.description}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { personas } from "@/lib/personas"

export type Persona = "hitesh" | "piyush" | "mannu"

interface PersonaToggleProps {
  currentPersona: Persona | null
  onPersonaChange: (persona: Persona) => void
}

export function PersonaToggle({ currentPersona, onPersonaChange }: PersonaToggleProps) {
  const personasData = personas.reduce(
    (acc, persona) => {
      acc[persona.id as Persona] = {
        name: persona.name,
        title: persona.title,
        avatar: persona.avatar,
        color:
          persona.id === "hitesh"
            ? "from-blue-500 to-purple-600"
            : persona.id === "piyush"
              ? "from-green-500 to-teal-600"
              : "from-orange-500 to-red-600", // Mannu's color
      }
      return acc
    },
    {} as Record<Persona, any>,
  )

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
      {Object.entries(personasData).map(([key, persona]) => (
        <Button
          key={key}
          variant={currentPersona === key ? "default" : "ghost"}
          onClick={() => onPersonaChange(key as Persona)}
          className={`flex items-center gap-3 px-4 py-3 h-auto transition-all duration-300 ${
            currentPersona === key
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "hover:bg-accent hover:text-accent-foreground hover:scale-102"
          }`}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={persona.avatar || "/placeholder.svg"} alt={persona.name} />
            <AvatarFallback className={`bg-gradient-to-br ${persona.color} text-white text-sm font-semibold`}>
              {persona.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <div className="font-heading font-semibold text-sm">{persona.name}</div>
            <div className="text-xs opacity-80">{persona.title}</div>
          </div>
        </Button>
      ))}
    </div>
  )
}

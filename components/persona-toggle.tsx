"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export type Persona = "hitesh" | "piyush"

interface PersonaToggleProps {
  currentPersona: Persona | null
  onPersonaChange: (persona: Persona) => void
}

export function PersonaToggle({ currentPersona, onPersonaChange }: PersonaToggleProps) {
  const personas = {
    hitesh: {
      name: "Hitesh Choudhary",
      title: "JavaScript & React Expert",
      avatar: "/indian-male-teacher-javascript.png",
      color: "from-blue-500 to-purple-600",
    },
    piyush: {
      name: "Piyush Garg",
      title: "Full-Stack Development Guru",
      avatar: "/placeholder-vnskw.png",
      color: "from-green-500 to-teal-600",
    },
  }

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border">
      {Object.entries(personas).map(([key, persona]) => (
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
                .map((n) => n[0])
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Persona } from "./persona-toggle"

interface ChatMessageProps {
  message: string
  isUser: boolean
  persona?: Persona
  timestamp?: Date
  isStreaming?: boolean
}

export function ChatMessage({ message, isUser, persona, timestamp, isStreaming = false }: ChatMessageProps) {
  const personas = {
    hitesh: {
      name: "Hitesh Choudhary",
      avatar: "/indian-male-teacher-javascript.png",
      color: "from-blue-500 to-purple-600",
    },
    piyush: {
      name: "Piyush Garg",
      avatar: "/placeholder-vnskw.png",
      color: "from-green-500 to-teal-600",
    },
  }

  const currentPersona = persona ? personas[persona] : null

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-300",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">You</AvatarFallback>
        ) : currentPersona ? (
          <>
            <AvatarImage src={currentPersona.avatar || "/placeholder.svg"} alt={currentPersona.name} />
            <AvatarFallback className={`bg-gradient-to-br ${currentPersona.color} text-white text-xs font-semibold`}>
              {currentPersona.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-accent text-accent-foreground">AI</AvatarFallback>
        )}
      </Avatar>

      <Card
        className={cn(
          "px-4 py-3 max-w-[80%] transition-all duration-200",
          isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-card text-card-foreground hover:bg-accent/50",
          isStreaming && "animate-pulse",
        )}
      >
        {!isUser && currentPersona && (
          <div className="text-xs font-heading font-semibold mb-1 opacity-80">{currentPersona.name}</div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message}
          {isStreaming && <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse opacity-70">|</span>}
        </div>
        {timestamp && !isStreaming && (
          <div className="text-xs opacity-60 mt-2">
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </Card>
    </div>
  )
}

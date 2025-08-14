"use client"

import { useState } from "react"
import { PersonaToggle, type Persona } from "@/components/persona-toggle"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Card } from "@/components/ui/card"
import { GraduationCap, MessageCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  isUser: boolean
  persona?: Persona
  timestamp: Date
}

interface ChatHistories {
  hitesh: Message[]
  piyush: Message[]
}

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)
  const [chatHistories, setChatHistories] = useState<ChatHistories>({
    hitesh: [
      {
        id: "hitesh-1",
        content:
          "Hello! I'm Hitesh Choudhary, and I'm here to help you with JavaScript, React, and modern web development. What would you like to learn today?",
        isUser: false,
        persona: "hitesh",
        timestamp: new Date(),
      },
    ],
    piyush: [
      {
        id: "piyush-1",
        content:
          "Hey! I'm Piyush Garg. Let's explore the world of full-stack development together. What would you like to build today?",
        isUser: false,
        persona: "piyush",
        timestamp: new Date(),
      },
    ],
  })
  const [isLoading, setIsLoading] = useState(false)

  const handlePersonaChange = (persona: Persona) => {
    setCurrentPersona(persona)
  }

  const handleSendMessage = async (content: string) => {
    if (!currentPersona) return

    // Add user message to current persona's chat
    const userMessage: Message = {
      id: `${currentPersona}-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date(),
    }

    setChatHistories((prev) => ({
      ...prev,
      [currentPersona]: [...prev[currentPersona], userMessage],
    }))
    setIsLoading(true)

    // Simulate API call - replace with your actual API integration
    setTimeout(() => {
      const responses = {
        hitesh: [
          "Great question! Let me break this down for you with a practical example...",
          "That's a common challenge in JavaScript. Here's how I approach it...",
          "Excellent! This is where React really shines. Let me show you...",
        ],
        piyush: [
          "Perfect timing for this question! In full-stack development, we need to consider...",
          "I love this topic! From a system design perspective...",
          "That's exactly what we need to build scalable applications. Here's my approach...",
        ],
      }

      const randomResponse = responses[currentPersona][Math.floor(Math.random() * responses[currentPersona].length)]

      const aiMessage: Message = {
        id: `${currentPersona}-${Date.now() + 1}`,
        content: randomResponse,
        isUser: false,
        persona: currentPersona,
        timestamp: new Date(),
      }

      setChatHistories((prev) => ({
        ...prev,
        [currentPersona]: [...prev[currentPersona], aiMessage],
      }))
      setIsLoading(false)
    }, 1500)
  }

  const currentMessages = currentPersona ? chatHistories[currentPersona] : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">EdTech AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Chat with Hitesh Choudhary and Piyush Garg</p>
            </div>
          </div>

          <PersonaToggle currentPersona={currentPersona} onPersonaChange={handlePersonaChange} />
        </div>
      </header>

      {/* Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {!currentPersona ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center max-w-md">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                Welcome to EdTech AI Assistant!
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Choose a tutor above to start your personalized learning journey. Each tutor has their own chat space
                with unique expertise and teaching style.
              </p>
              <div className="text-sm text-muted-foreground/80">
                Click on <strong>Hitesh Choudhary</strong> for JavaScript & React or <strong>Piyush Garg</strong> for
                Full-Stack Development
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Welcome Card for selected persona */}
            {currentMessages.length === 1 && (
              <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold text-foreground">
                    Chat with {currentPersona === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You're now in {currentPersona === "hitesh" ? "Hitesh's" : "Piyush's"} dedicated chat space. Your
                  conversation history is separate and personalized for each tutor.
                </p>
              </Card>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {currentMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  persona={message.persona}
                  timestamp={message.timestamp}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span>{currentPersona === "hitesh" ? "Hitesh" : "Piyush"} is thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Area - only show when persona is selected */}
        {currentPersona && (
          <div className="sticky bottom-0 pt-6 pb-4 bg-background/80 backdrop-blur-sm">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={`Ask ${currentPersona === "hitesh" ? "Hitesh" : "Piyush"} anything about web development...`}
            />
          </div>
        )}
      </main>
    </div>
  )
}

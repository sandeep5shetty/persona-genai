"use client"

import { useState } from "react"
import { PersonaToggle, type Persona } from "@/components/persona-toggle"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { SystemPromptModal } from "@/components/system-prompt-modal"
import { Card } from "@/components/ui/card"
import { GraduationCap, MessageCircle } from "lucide-react"
import { personas } from "@/lib/personas"

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
  mannu: Message[]
}

interface SystemPrompts {
  hitesh: string
  piyush: string
  mannu: string
}

export default function Home() {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null)
  const [chatHistories, setChatHistories] = useState<ChatHistories>({
    hitesh: [
      {
        id: "hitesh-1",
        content:
          "Hanji! Main Hitesh Choudhary hun, aur main yahan hun aapki JavaScript, React, aur modern web development mein madad karne ke liye. Chai leke aao aur batao kya seekhna hai aaj? ☕💻",
        isUser: false,
        persona: "hitesh",
        timestamp: new Date(),
      },
    ],
    piyush: [
      {
        id: "piyush-1",
        content:
          "Dekho bhai! Main Piyush Garg hun. Full-stack development ki duniya explore karte hain saath mein. Aaj kya build karna hai? 🔥💻",
        isUser: false,
        persona: "piyush",
        timestamp: new Date(),
      },
    ],
    mannu: [
      {
        id: "mannu-1",
        content:
          "Oye chill gyus! Mannu paaji yahan hai. Coding bhi karte hain, party bhi karte hain - vo wali party! Kya baat hai aaj? 🎉💻",
        isUser: false,
        persona: "mannu",
        timestamp: new Date(),
      },
    ],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState("")

  const [systemPrompts, setSystemPrompts] = useState<SystemPrompts>({
    hitesh: "",
    piyush: "",
    mannu: "",
  })

  const handlePersonaChange = (persona: Persona) => {
    setCurrentPersona(persona)
  }

  const handleSystemPromptUpdate = (persona: Persona, prompt: string) => {
    setSystemPrompts((prev) => ({
      ...prev,
      [persona]: prompt,
    }))
  }

  const handleSendMessage = async (content: string) => {
    if (!currentPersona) return

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
    setStreamingMessage("")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          persona: currentPersona,
          chatHistory: chatHistories[currentPersona],
          systemPrompt: systemPrompts[currentPersona], // Include custom system prompt
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6)
              if (data === "[DONE]") {
                const aiMessage: Message = {
                  id: `${currentPersona}-${Date.now() + 1}`,
                  content: accumulatedContent,
                  isUser: false,
                  persona: currentPersona,
                  timestamp: new Date(),
                }

                setChatHistories((prev) => ({
                  ...prev,
                  [currentPersona]: [...prev[currentPersona], aiMessage],
                }))
                setStreamingMessage("")
                setIsLoading(false)
                return
              }

              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  accumulatedContent += parsed.content
                  setStreamingMessage(accumulatedContent)
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: `${currentPersona}-error-${Date.now()}`,
        content: "Sorry, I'm having trouble connecting right now. Please check your API configuration and try again.",
        isUser: false,
        persona: currentPersona,
        timestamp: new Date(),
      }

      setChatHistories((prev) => ({
        ...prev,
        [currentPersona]: [...prev[currentPersona], errorMessage],
      }))
      setIsLoading(false)
      setStreamingMessage("")
    }
  }

  const currentMessages = currentPersona ? chatHistories[currentPersona] : []

  const getPersonaDisplayName = (persona: Persona) => {
    const personaData = personas.find((p) => p.id === persona)
    return personaData?.name || persona
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">EdTech AI Assistant</h1>
              <p className="text-sm text-muted-foreground">Chat with Hitesh Choudhary, Piyush Garg & Mannu Paaji</p>
            </div>
            {currentPersona && (
              <div className="ml-auto">
                <SystemPromptModal
                  currentPrompt={systemPrompts[currentPersona]}
                  onSave={(prompt) => handleSystemPromptUpdate(currentPersona, prompt)}
                  persona={currentPersona}
                />
              </div>
            )}
          </div>

          <PersonaToggle currentPersona={currentPersona} onPersonaChange={handlePersonaChange} />
        </div>
      </header>

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
                Click on <strong>Hitesh Choudhary</strong> for JavaScript & React, <strong>Piyush Garg</strong> for
                Full-Stack Development, or <strong>Mannu Paaji</strong> for UI Design & Chill Coding
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {currentMessages.length === 1 && (
              <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold text-foreground">
                    Chat with {getPersonaDisplayName(currentPersona)}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You're now in {getPersonaDisplayName(currentPersona)}'s dedicated chat space. Your conversation
                  history is separate and personalized for each tutor.
                </p>
              </Card>
            )}

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

              {streamingMessage && (
                <ChatMessage
                  message={streamingMessage}
                  isUser={false}
                  persona={currentPersona}
                  timestamp={new Date()}
                  isStreaming={true}
                />
              )}
            </div>

            {isLoading && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  </div>
                  <span>{getPersonaDisplayName(currentPersona)} is thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPersona && (
          <div className="sticky bottom-0 pt-6 pb-4 bg-background/80 backdrop-blur-sm">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={`Ask ${getPersonaDisplayName(currentPersona)} anything about web development...`}
            />
          </div>
        )}
      </main>
    </div>
  )
}

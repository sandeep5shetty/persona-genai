"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings } from "lucide-react"

interface SystemPromptModalProps {
  currentPrompt: string
  onSave: (prompt: string) => void
  persona: "hitesh" | "piyush"
}

export function SystemPromptModal({ currentPrompt, onSave, persona }: SystemPromptModalProps) {
  const [prompt, setPrompt] = useState(currentPrompt)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    onSave(prompt)
    setIsOpen(false)
  }

  const personaName = persona === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      
      
    </Dialog>
  )
}

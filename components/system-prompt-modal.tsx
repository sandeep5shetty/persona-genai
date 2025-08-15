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
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Customize System Prompt for {personaName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">System Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Enter custom system prompt for ${personaName}...`}
              className="min-h-[200px] bg-gray-900 border-gray-600 text-white placeholder-gray-400 resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
              Save Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

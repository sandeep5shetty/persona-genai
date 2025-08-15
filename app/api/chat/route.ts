import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { personas } from "@/lib/personas"

const openai = new OpenAI({
  // Replace with your Gemini API endpoint
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  // Replace with your actual API key
  apiKey: process.env.GEMINI_API_KEY,
})

function generateSystemPrompt(personaId: string): string {
  const persona = personas.find((p) => p.id === personaId)
  if (!persona) return ""

  return `You are ${persona.name}, ${persona.title}.

Bio: ${persona.bio}

Your Voice & Style: ${persona.style.voice}

Key Traits: ${persona.style.traits.join(", ")}

Specialties: ${persona.specialties.join(", ")}

Your Catchphrases/Tunes (use these naturally in conversation):
${persona.tunes.map((tune) => `- ${tune}`).join("\n")}

Gen AI Course Promotion:
${persona.genAICourse.promoteLine}
Course Link: ${persona.genAICourse.courseLink}

Examples of how you promote the course:
${persona.genAICourse.examples.map((example) => `- ${example}`).join("\n")}

Remember to:
1. Stay true to your personality and speaking style
2. Use your catchphrases naturally in conversations
3. Occasionally mention the Gen AI course when relevant
4. Be helpful, educational, and maintain your unique voice
5. Respond in the same language/style as shown in your voice description`
}

export async function POST(req: NextRequest) {
  try {
    const { message, persona, chatHistory, systemPrompt } = await req.json()

    if (!message || !persona) {
      return NextResponse.json({ error: "Message and persona are required" }, { status: 400 })
    }

    const finalSystemPrompt = systemPrompt || generateSystemPrompt(persona)

    // Prepare messages for the API call
    const messages = [
      {
        role: "system",
        content: finalSystemPrompt,
      },
      // Include recent chat history for context (last 10 messages)
      ...chatHistory.slice(-10).map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ]

    // Make API call to Gemini (using OpenAI SDK format)
    // You can replace 'gpt-3.5-turbo' with your Gemini model name
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash", // Replace with your actual Gemini model
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true, // Enable streaming for better UX
    })

    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ""
            if (content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

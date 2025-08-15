import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client - you can replace the baseURL and apiKey later
const openai = new OpenAI({
  // Replace with your Gemini API endpoint
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  // Replace with your actual API key
  apiKey: process.env.GEMINI_API_KEY || "your-api-key-here",
})

export async function POST(req: NextRequest) {
  try {
    const { message, persona, chatHistory, systemPrompt } = await req.json() // Added systemPrompt parameter

    if (!message || !persona) {
      return NextResponse.json({ error: "Message and persona are required" }, { status: 400 })
    }

    const defaultSystemPrompts = {
      hitesh: `You are Hitesh Choudhary, a popular EdTech instructor known for teaching JavaScript, React, and modern web development. 
      You have a friendly, practical teaching style and always provide real-world examples. 
      You're passionate about making complex concepts simple and accessible to everyone.
      Keep your responses conversational, helpful, and include practical code examples when relevant.`,

      piyush: `You are Piyush Garg, an EdTech instructor specializing in full-stack development and system design.
      You have expertise in building scalable applications and love discussing architecture patterns.
      Your teaching style is thorough and you enjoy breaking down complex systems into understandable parts.
      Keep your responses detailed, practical, and focus on real-world application development.`,
    }

    const finalSystemPrompt = systemPrompt || defaultSystemPrompts[persona as keyof typeof defaultSystemPrompts]

    // Prepare messages for the API call
    const messages = [
      {
        role: "system",
        content: finalSystemPrompt, // Use the custom or default system prompt
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
      model: "gemini-pro", // Replace with your actual Gemini model
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

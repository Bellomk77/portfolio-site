import Anthropic from '@anthropic-ai/sdk'
import { TAX_AI_SYSTEM_PROMPT } from '@/lib/nigerian-tax-data'

export const runtime = 'edge'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response('Missing message', { status: 400 })
    }

    const messages = [
      ...history
        .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      { role: 'user' as const, content: message },
    ]

    const stream = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2048,
      system:     TAX_AI_SYSTEM_PROMPT,
      messages,
      stream:     true,
    })

    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('TaxPadi AI error:', err)

    if (err instanceof Anthropic.APIError) {
      return new Response(
        `API error: ${err.status} — ${err.message}. Check your ANTHROPIC_API_KEY in .env.local`,
        { status: err.status }
      )
    }

    return new Response('Internal server error', { status: 500 })
  }
}

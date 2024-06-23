export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  let interval: NodeJS.Timeout

  const encoder = new TextEncoder()

  const customReadable = new ReadableStream({
    start(controller) {
      interval = setInterval(() => {
        const message = new Date().toLocaleString()
        controller.enqueue(encoder.encode(`data: ${message}\n\n`))
      }, 1000)
    },
    cancel() {
      clearInterval(interval)
    },
  })

  return new Response(customReadable, {
    headers: {
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8',
    },
  })
}

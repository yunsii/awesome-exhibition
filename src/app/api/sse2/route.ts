export async function GET(request: Request) {
  const encoder = new TextEncoder()
  const stream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk)
    },
  })
  const writer = stream.writable.getWriter()

  const sseData = `:ok\n\nevent: message\ndata: Initial message\n\n`
  writer.write(encoder.encode(sseData))

  let counter = 0

  const interval = setInterval(() => {
    counter++

    if (counter > 10) {
      clearInterval(interval)
      return
    }

    const message = `event: message\ndata: Message ${counter}\n\n`
    writer.write(encoder.encode(message))
  }, 1000)

  request.signal.addEventListener('abort', async () => {
    await writer.ready
    await writer.close()
    clearInterval(interval)
  })

  const response = new Response(stream.readable)

  response.headers.set('Content-Type', 'text/event-stream')
  response.headers.set('Cache-Control', 'no-cache')
  response.headers.set('Connection', 'keep-alive')

  return response
}

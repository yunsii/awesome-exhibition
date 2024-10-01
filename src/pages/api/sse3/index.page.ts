import { createNextApi } from '../_helpers/api'

// This is required to enable streaming
export const dynamic = 'force-dynamic'

export default createNextApi({
  GET: async (request, response) => {
    Object.entries({
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream; charset=utf-8',
    }).forEach(([key, value]) => {
      response.setHeader(key, value)
    })

    const sendEvent = (data: Record<string, string>) => {
      response.write(`data: ${JSON.stringify(data)}\n\n`)
    }

    const intervalId = setInterval(() => {
      const message = {
        time: new Date().toISOString(),
        message: 'Hello from the server!',
      }
      sendEvent(message)
    }, 2000)

    response.on('close', () => {
      clearInterval(intervalId)
      response.end()
    })
  },
})

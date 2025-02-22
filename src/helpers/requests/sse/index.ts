import { createParser } from 'eventsource-parser'

import type { EventSourceMessage } from 'eventsource-parser'

import { streamAsyncIterable } from './stream-async-iterable'

export interface IFetchSSEOptions extends RequestInit {
  /**
   * fetch 请求完成后回调
   *
   * 值得注意的是，fetch 默认不会抛出异常，可根据 response.ok 判断请求是否成功
   */
  onResponse?: (response: Response) => void | Promise<void>
  /**
   * 可在消息反序列化之前处理原始 message 字符串
   */
  beforeParseEvent?: (messageStr: string) => void | Promise<void>
  onEvent: (parsedEvent: EventSourceMessage) => void
}

/** ref: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events */
export async function fetchSSE(resource: string, options: IFetchSSEOptions) {
  const {
    onEvent,
    beforeParseEvent,
    onResponse,
    ...fetchOptions
  } = options

  const parser = createParser({
    onEvent,
  })

  try {
    const response = await fetch(resource, fetchOptions)
    await onResponse?.(response)

    if (!response.ok) {
      return
    }

    for await (const chunk of streamAsyncIterable(response.body!)) {
      const str = new TextDecoder().decode(chunk)
      await beforeParseEvent?.(str)
      parser.feed(str)
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      // Do nothing
      return
    }
    throw err
  }
}

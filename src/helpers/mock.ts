export function got<T>(
  data: T,
  options: { delay?: number; errorDelay?: number | null } = {},
) {
  const { delay = 1000, errorDelay } = options

  return new Promise<T>((resolve, reject) => {
    if (errorDelay) {
      setTimeout(() => {
        reject(new Error(`Error after ${errorDelay}`))
      }, errorDelay)
    }
    setTimeout(() => {
      return resolve(data)
    }, delay)
  })
}

export class NotFoundError extends Error {
  name = 'NotFoundError'

  constructor(message: string) {
    super(message)
  }
}

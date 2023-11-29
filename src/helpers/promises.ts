// ref: https://www.typescriptlang.org/docs/handbook/2/generics.html#using-class-types-in-generics
export function throwErrorHelper<E extends Error>(CustomError: {
  new (message: string): E
}) {
  return <Arguments extends unknown[], ReturnType>(
    task: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
    ..._arguments: Arguments
  ) => {
    return async (options: { fallbackMessage: string }) => {
      const { fallbackMessage } = options
      try {
        const result = await task(..._arguments)
        return result
      } catch (err) {
        if (err instanceof CustomError) {
          throw err
        }
        if (err instanceof Error) {
          throw new CustomError(err.message)
        }
        throw new CustomError(fallbackMessage)
      }
    }
  }
}

// type ref：https://github.com/sindresorhus/p-limit/blob/main/index.d.ts
export function fallback<Arguments extends unknown[], ReturnType>(
  task: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
  ..._arguments: Arguments
) {
  async function run(options: {
    defaultValue: null
    onError?: (error: unknown) => void
  }): Promise<ReturnType | null>
  async function run(options: {
    defaultValue: ReturnType
    onError?: (error: unknown) => void
  }): Promise<ReturnType>
  async function run(options: {
    defaultValue: ReturnType | null
    onError?: (error: unknown) => void
  }) {
    const { defaultValue, onError } = options
    try {
      const result = await task(..._arguments)
      return result
    } catch (err) {
      onError?.(err)
      return defaultValue
    }
  }

  return run
}

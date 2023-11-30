function throwErrorHelper<E extends Error>(
  // type ref: https://www.typescriptlang.org/docs/handbook/2/generics.html#using-class-types-in-generics
  CustomError: {
    new (message: string): E
  },
  /** Default onError callback, you use it to print log */
  onRawErrorDefault?: (error: unknown) => void,
) {
  return <Arguments extends unknown[], ReturnType>(
    task: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
    ..._arguments: Arguments
  ) => {
    return async (options: {
      fallbackMessage: string
      /**
       * Custom onError callback to overwrite default onError callback,
       * you use it to print log
       */
      onRawError?: (error: unknown) => void
    }) => {
      const { fallbackMessage, onRawError } = options
      const internalOnRawError = onRawError || onRawErrorDefault

      try {
        const result = await task(..._arguments)
        return result
      } catch (err) {
        internalOnRawError?.(err)
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

function fallbackHelper(
  /** Default onError callback, you use it to print log */
  onRawErrorDefault?: (error: unknown) => void,
) {
  // type ref：https://github.com/sindresorhus/p-limit/blob/main/index.d.ts
  return <Arguments extends unknown[], ReturnType>(
    task: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
    ..._arguments: Arguments
  ) => {
    async function run(options: {
      defaultValue: null
      /**
       * Custom onError callback to overwrite default onError callback,
       * you use it to print log
       */
      onRawError?: (error: unknown) => void
    }): Promise<ReturnType | null>
    async function run(options: {
      defaultValue: ReturnType
      /**
       * Custom onError callback to overwrite default onError callback,
       * you use it to print log
       */
      onRawError?: (error: unknown) => void
    }): Promise<ReturnType>
    async function run(options: {
      defaultValue: ReturnType | null
      onRawError?: (error: unknown) => void
    }) {
      const { defaultValue, onRawError } = options
      const internalOnRawError = onRawError || onRawErrorDefault

      try {
        const result = await task(..._arguments)
        return result
      } catch (err) {
        internalOnRawError?.(err)
        return defaultValue
      }
    }

    return run
  }
}

export const pConditional = {
  throwErrorHelper,
  fallbackHelper,
}

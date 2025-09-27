import { useMemoizedFn } from 'ahooks'
import { useEffect } from 'react'

/**
 * 设计上只是为了方便挂载和调用页面内由**用户操作**触发的全局回调函数，比如：`onClick`、`onChange` 等等。
 *
 * 不应该用来处理**异步**的全局回调，比如 `onMount`，这样会导致 global handler 还没注册就被调用。
 * 这种情况不是该方案考虑的范围，请在外部自行解决，或者实在得用上这个方案再讨论后决定是否扩展能力。
 */
export function createGlobalHandler<T extends (...args: any[]) => void>() {
  const callbackName = Symbol('global-handler')

  const useMountGlobalHandler = (callback: T) => {
    const latestCallback = useMemoizedFn(callback)

    useEffect(() => {
      if (callbackName in window) {
        throw new Error(`Global handler with name ${String(callbackName)} already exists.`)
      }

      (window as any)[callbackName] = latestCallback
      return () => {
        delete (window as any)[callbackName]
      }
    }, [latestCallback])
  }

  const callGlobalHandler = (...args: Parameters<T>) => {
    if (callbackName in window) {
      return (window as any)[callbackName](...args)
    }
    throw new Error(`Global handler with name ${String(callbackName)} is not defined. Call with args: ${JSON.stringify(args)}`)
  }

  return [
    useMountGlobalHandler,
    callGlobalHandler,
  ] as const
}

import type { LoaderContext } from 'webpack'

import { createContext } from './context'

import type { LoaderOptions } from '../types'

export default async function loader(this: LoaderContext<LoaderOptions>, source: string) {
  const callback = this.async()
  const options: LoaderOptions = (this.getOptions ? this.getOptions() : {})
  const filePath = this.resourcePath

  try {
    const ctx = await createContext(options)

    await ctx.emitDts(this)

    const result = await ctx.transform(filePath, source)

    if (result) {
      return callback(null, result.code, result.map)
    }

    // if nothing changed, return original content
    return callback(null, source)
  } catch (err) {
    if (err instanceof Error) {
      return callback(err)
    } else {
      return callback(new Error(String(err)))
    }
  }
}

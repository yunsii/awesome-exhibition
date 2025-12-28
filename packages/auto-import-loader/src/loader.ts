import { createUnimport } from 'unimport'

import type { LoaderContext } from 'webpack'

import { generateAndEmitDts } from './dts-emitter'
import { flattenImports } from './flatten-imports'
import { injectImportsIntoSource } from './import-injector'
import { logger } from './logger'
import { transformForAnalysis } from './transformer'

import type { LoaderOptions } from './types'

export default async function loader(this: LoaderContext<LoaderOptions>, source: string) {
  const callback = this.async()
  const options: LoaderOptions = (this.getOptions ? this.getOptions() : {})
  const resource = this.resourcePath

  if (options.logLevel) {
    logger.level = options.logLevel
  }

  try {
    const unimport = createUnimport({
      imports: await flattenImports(options.imports || []),
      dirs: options.dirs || [],
      presets: options.presets || [],
      injectAtEnd: true,
    })

    await unimport.init()

    await generateAndEmitDts(unimport, options, this)

    const analysisCode = await transformForAnalysis(resource, source)

    const injectResult = await injectImportsIntoSource(unimport, resource, source, analysisCode)

    if (injectResult) {
      return callback(null, injectResult.code, injectResult.map)
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

import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'
import { createUnimport, stringifyImports, stripCommentsAndStrings } from 'unimport'

import type { SourceMap } from 'magic-string'
import type { LoaderContext } from 'webpack'

import { detectIsJsxResource } from '../shared/helpers'
import { logger } from '../shared/logger'
import { emitDts, flattenImports, prepareSourceCode } from './utils'

import type { LoaderOptions } from '../types'

export interface Context {
  readonly unimport: ReturnType<typeof createUnimport>
  readonly options: LoaderOptions
  transform: (filePath: string, source: string) => Promise<{ code: string, map?: SourceMap } | null>
  emitDts: (loaderContext: LoaderContext<LoaderOptions>) => Promise<void>
}

export async function createContext(options: LoaderOptions): Promise<Context> {
  if (options.logLevel) {
    logger.level = options.logLevel
  }

  const unimport = createUnimport({
    imports: await flattenImports(options.imports || []),
    dirs: options.dirs || [],
    presets: options.presets || [],
    // 考虑到 'use client' 的情况，默认开启 injectAtEnd
    injectAtEnd: true,
  })

  await unimport.init()

  /**
   * Transform regular JS/TS files: inject imports directly into the normalized source
   */
  async function transformRegularFile(filePath: string, source: string) {
    const content = new MagicString(source)
    const result = await unimport.injectImports(content, filePath)

    if (!result.s.hasChanged()) {
      return null
    }

    logger.info(`Injected imports for ${filePath}`)
    return {
      code: result.s.toString(),
      map: result.s.generateMap({ source: filePath, includeContent: true, hires: true }),
    }
  }

  /**
   * Transform JSX/TSX files: normalize JSX → detect imports → inject into original source
   */
  async function transformJsxFile(filePath: string, source: string) {
    // Step 1: Normalize JSX to detect what needs to be imported
    const normalizedSource = await prepareSourceCode(filePath, source)
    const normalizedContent = new MagicString(normalizedSource)
    const result = await unimport.injectImports(normalizedContent, filePath)

    if (!result.s.hasChanged()) {
      return null
    }

    // Step 2: Inject detected imports into the original source
    const originalContent = new MagicString(source)
    const { isCJSContext, firstOccurrence } = await unimport.detectImports(originalContent)
    const strippedCode = stripCommentsAndStrings(originalContent.original)

    // Find the correct insertion point for imports
    const insertionIndex = findStaticImports(originalContent.original)
      .filter((i) => Boolean(strippedCode.slice(i.start, i.end).trim()))
      .map((i) => parseStaticImport(i))
      .reverse()
      .find((i) => i.end <= firstOccurrence)
      ?.end ?? 0

    const importStatements = stringifyImports(result.imports, isCJSContext)
    if (importStatements && insertionIndex >= 0) {
      originalContent.appendRight(insertionIndex, `\n${importStatements}\n`)
    } else {
      originalContent.prepend(`${importStatements}\n`)
    }

    logger.info(`Injected imports for ${filePath}`)
    return {
      code: originalContent.toString(),
      map: originalContent.generateMap({ source: filePath, includeContent: true, hires: true }),
    }
  }

  return {
    unimport,
    options,

    async transform(filePath: string, source: string) {
      const isJSX = detectIsJsxResource(filePath)
      const result = isJSX
        ? await transformJsxFile(filePath, source)
        : await transformRegularFile(filePath, source)

      return result || { code: source }
    },

    async emitDts(loaderContext: LoaderContext<LoaderOptions>) {
      await emitDts(unimport, options, loaderContext)
    },
  }
}

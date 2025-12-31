import MagicString from 'magic-string'
import { findStaticImports, parseStaticImport } from 'mlly'
import { stringifyImports, stripCommentsAndStrings } from 'unimport'

import type { SourceMap } from 'magic-string'
import type { createUnimport } from 'unimport'

import { detectIsJsxResource } from './helpers'
import { logger } from './logger'

export async function injectImportsIntoSource(
  unimport: ReturnType<typeof createUnimport>,
  resource: string,
  source: string,
  analysisCode: string,
): Promise<{ code: string, map?: SourceMap } | null> {
  let s = new MagicString(analysisCode)

  // core transform: inject imports into the MagicString
  const result = await unimport.injectImports(s, resource)
  s = result.s

  // 转换后如果没有变化，直接返回 null
  if (!s.hasChanged()) {
    return { code: source }
  }

  const isJSX = detectIsJsxResource (resource)

  // 如果不是 JSX 资源，直接返回转换结果
  if (!isJSX) {
    logger.info(`Injected imports for ${resource}`)
    return {
      code: s.toString(),
      map: s.generateMap({ source: resource, includeContent: true, hires: true }),
    }
  }

  // 对于 JSX 资源，需要将注入的 import 替换回原始 source 中
  const finalS = new MagicString(source)

  const { isCJSContext, matchedImports, firstOccurrence } = await unimport.detectImports(finalS)
  const strippedCode = stripCommentsAndStrings(finalS.original)
  // 核心逻辑参考：https://github.com/unjs/unimport/blob/6bbe5a733c0729cf429d4f16c64d3014acaf5143/src/utils.ts#L376-L377
  const insertionIndex = findStaticImports(finalS.original)
    .filter((i) => Boolean(strippedCode.slice(i.start, i.end).trim()))
    .map((i) => parseStaticImport(i))
    .reverse()
    .find((i) => i.end <= firstOccurrence)
    ?.end ?? 0

  const newEntries = stringifyImports(result.imports, isCJSContext)
  if (newEntries && insertionIndex >= 0) {
    finalS.appendRight(insertionIndex, `\n${newEntries}\n`)
  } else {
    finalS.prepend(`${newEntries}\n`)
  }

  logger.info(`Injected imports for ${resource}`)

  return {
    code: finalS.toString(),
    map: finalS.generateMap({ source: resource, includeContent: true, hires: true }),
  }
}

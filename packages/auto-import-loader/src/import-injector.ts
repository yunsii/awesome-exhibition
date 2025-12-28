import MagicString from 'magic-string'

import type { SourceMap } from 'magic-string'
import type { createUnimport } from 'unimport'

import { detectIsJsxResource } from './helpers'
import { logger } from './logger'

export function extractImportsBlock(code: string): { block: string, start: number, end: number } | null {
  // Find all import lines (allowing leading whitespace)
  const importRegex = /^\s*import\s.*$/gm
  const matches = Array.from(code.matchAll(importRegex))
  if (matches.length === 0) {
    return null
  }

  // Get the start of the first import and end of the last import
  const start = matches[0].index
  const lastMatch = matches[matches.length - 1]
  const end = lastMatch.index + lastMatch[0].length

  const block = code.slice(start, end)
  return { block, start, end }
}

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

  const originalImports = extractImportsBlock(source)
  const injectedImports = extractImportsBlock(s.toString())

  if (!injectedImports) {
    // 不可能没有注入的 import
    logger.warn(`No injected imports found for JSX resource ${resource}`)
    return {
      code: source,
    }
  }

  const finalS = new MagicString(source)
  if (originalImports) {
    finalS.overwrite(originalImports.start, originalImports.end, injectedImports.block)
  } else {
    // No original imports, prepend the injected ones
    // TODO: 应该会导致只写 'use client' 的文件且没有 import 语句的文件异常，不过 unimport 本身好像也没有处理这种情况，先不管了
    finalS.prepend(`${injectedImports.block}\n`)
  }

  logger.info(`Injected imports for ${resource}`)

  return {
    code: finalS.toString(),
    map: finalS.generateMap({ source: resource, includeContent: true, hires: true }),
  }
}

import MagicString from 'magic-string'

import type { createUnimport } from 'unimport'

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
): Promise<{ code: string, map?: any } | null> {
  let s = new MagicString(analysisCode)

  // core transform: inject imports into the MagicString
  const result = await unimport.injectImports(s, resource)
  s = result.s

  const injectedImports = extractImportsBlock(s.toString())
  const originalImports = extractImportsBlock(source)

  // If there are changes in the imports block, apply to original source
  if (injectedImports && (originalImports || injectedImports.block !== (originalImports?.block || ''))) {
    const finalS = new MagicString(source)
    if (originalImports) {
      finalS.overwrite(originalImports.start, originalImports.end, injectedImports.block)
    } else {
      // No original imports, prepend the injected ones
      finalS.prepend(`${injectedImports.block}\n`)
    }

    logger.info(`Injected imports for ${resource}`)

    const map = finalS.generateMap({ source: resource, includeContent: true, hires: true })
    logger.debug(`Finished processing resource: ${resource}`)

    return { code: finalS.toString(), map }
  }

  return null
}

import { toArray } from '@antfu/utils'
import { resolvePreset } from 'unimport'

import type { Import, InlinePreset } from 'unimport'

import type { LoaderOptions } from './types'

export async function flattenImports(map: LoaderOptions['imports']): Promise<Import[]> {
  const promises = await Promise.all(toArray(map)
    .map(async (definition) => {
      if ('from' in definition && 'imports' in definition) {
        return await resolvePreset(definition as InlinePreset)
      } else if ('name' in definition && 'from' in definition) {
        // It's an Import object
        return [definition as Import]
      } else {
        const resolved: Import[] = []
        for (const mod of Object.keys(definition)) {
          for (const id of definition[mod]) {
            const meta = {
              from: mod,
            } as Import
            if (Array.isArray(id)) {
              meta.name = id[0]
              meta.as = id[1]
            } else {
              meta.name = id
              meta.as = id
            }
            resolved.push(meta)
          }
        }
        return resolved
      }
    }))

  return promises.flat()
}

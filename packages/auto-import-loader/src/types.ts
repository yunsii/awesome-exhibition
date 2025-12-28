import type { Arrayable } from '@antfu/utils'
import type { LogLevel } from 'consola'
import type { Import, InlinePreset, Preset } from 'unimport'

export type ImportNameAlias = [string, string]

export type ImportsMap = Record<string, (string | ImportNameAlias)[]>

export interface LoaderOptions {
  imports?: Arrayable<Import | ImportsMap | InlinePreset>
  dirs?: string[]
  presets?: Preset[]
  /** emit generated d.ts; true -> `auto-imports.d.ts` or string filename */
  dts?: string | boolean
  /** ref: https://github.com/unjs/consola#log-level */
  logLevel?: LogLevel
}

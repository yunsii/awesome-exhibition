import { transform } from 'oxc-transform'

import { detectIsJsxResource } from './helpers'

export async function transformForAnalysis(resource: string, source: string): Promise<string> {
  const isJSX = detectIsJsxResource(resource)
  if (!isJSX) {
    return source
  }

  const result = await transform(resource, source, {
    lang: resource.endsWith('.tsx') ? 'tsx' : 'jsx',
    // 仅供分析代码 imports 使用，故不需要完整转换
    jsx: { runtime: 'classic' },
    sourcemap: false, // For simplicity, disable sourcemap for now
  })
  return result.code
}

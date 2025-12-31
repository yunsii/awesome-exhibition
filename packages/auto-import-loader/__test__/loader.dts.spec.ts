import { describe, it, expect} from 'vitest'

import loader from '../src/loader'

function runLoaderWithEmit(source: string, options = {}) {
  return new Promise<{ code: string; files: Record<string, string> }>((resolve, reject) => {
    const emitted: Record<string, string> = {}
    const ctx: any = {
      resourcePath: '/test/file.js',
      getOptions: () => options,
      async() {
        return (err: Error | null, result?: string) => {
          if (err) return reject(err)
          resolve({ code: result || '', files: emitted })
        }
      },
      emitFile: (name: string, content: string) => {
        emitted[name] = content
      },
      emitWarning: () => {},
    }
    // @ts-ignore
    loader.call(ctx, source)
  })
}

describe('auto-import-loader d.ts emission', () => {
  it('emits d.ts when configured', async () => {
    const { files, code } = await runLoaderWithEmit('const x = ref(0)', { imports: [{ name: 'ref', from: 'vue' }], dts: true })
    expect(code).toBe(`import { ref } from 'vue';
const x = ref(0)`)
    expect(files['auto-imports.d.ts']).toEqual(expect.stringContaining("declare global"))
  })
})

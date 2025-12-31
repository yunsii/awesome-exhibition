import { describe, it, expect } from 'vitest'

import loader from '../src/loader'

function runLoader(source: string, options = {}, resourcePath = '/test/file.js') {
  return new Promise<{ code: string; map?: any }>((resolve, reject) => {
    const ctx: any = {
      resourcePath,
      getOptions: () => options,
      async() {
        return (err: Error | null, result?: string, map?: any) => {
          if (err) return reject(err)
          resolve({ code: result || '', map })
        }
      },
      emitWarning() {},
    }
    // @ts-ignore
    loader.call(ctx, source)
  })
}

describe('auto-import-loader', () => {
  it('injects named import for used identifier (JS)', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }] }
    const src = `const count = ref(0)`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import { ref } from 'vue';
const count = ref(0)`)
  })

  it('injects import at the end when injectAtEnd is true', async () => {
    const options = { imports: [{ name: 'foo', from: 'bar' }], injectAtEnd: true }
    const src = `console.log(foo)`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import { foo } from 'bar';
console.log(foo)`)
  })

  it('handles TSX/JSX style usage', async () => {
    const options = { imports: [{ name: 'useState', from: 'react' }] }
    const src = `function Comp(){ const [s, setS] = useState(0); return <div>{s}</div> }`
    const { code } = await runLoader(src, options, '/test/file.jsx')
    expect(code).toBe(`
import { useState } from 'react';
function Comp(){ const [s, setS] = useState(0); return <div>{s}</div> }`)
  })

  it('handles TSX files', async () => {
    const options = { imports: [{ name: 'useState', from: 'react' }] }
    const src = `function Comp(): JSX.Element { const [s, setS] = useState(0); return <div>{s}</div> }`
    const { code } = await runLoader(src, options, '/test/file.tsx')
    expect(code).toBe(`
import { useState } from 'react';
function Comp(): JSX.Element { const [s, setS] = useState(0); return <div>{s}</div> }`)
  })

  it('injects default import for used identifier', async () => {
    const options = { imports: [{ name: 'default', as: 'Vue', from: 'vue' }] }
    const src = `const app = Vue.createApp({})`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import Vue from 'vue';
const app = Vue.createApp({})`)
  })

  it('injects namespace import for used identifier', async () => {
    const options = { imports: [{ name: '*', as: 'React', from: 'react' }] }
    const src = `const element = React.createElement('div')`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import * as React from 'react';
const element = React.createElement('div')`)
  })

  it('uses presets', async () => {
    const options = { presets: ['vue'] }
    const src = `const count = ref(0)`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import { ref } from 'vue';
const count = ref(0)`)
  })

  it('handles TypeScript files', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }] }
    const src = `const count: Ref<number> = ref(0)`
    const { code } = await runLoader(src, options, '/test/file.ts')
    expect(code).toBe(`import { ref } from 'vue';
const count: Ref<number> = ref(0)`)
  })

  it('does not inject when identifier is not used', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }] }
    const src = `const count = 0`
    const { code } = await runLoader(src, options)
    expect(code).toBe('const count = 0')
  })

  it('injects React component imports', async () => {
    const options = { imports: [{ name: 'Button', from: 'antd' }, { name: 'useState', from: 'react' }] }
    const src = `function App() { const [count, setCount] = useState(0); return <Button onClick={() => setCount(count + 1)}>{count}</Button> }`
    const { code } = await runLoader(src, options, '/test/file.tsx')
    expect(code).toBe(`
import { useState } from 'react';
import { Button } from 'antd';
function App() { const [count, setCount] = useState(0); return <Button onClick={() => setCount(count + 1)}>{count}</Button> }`)
  })

  it('returns original source when no changes', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }] }
    const src = `const count = 0`
    const { code } = await runLoader(src, options)
    expect(code).toBe(src)
  })

  it('generates sourcemap based on original source for JSX files', async () => {
    const options = { imports: [{ name: 'useState', from: 'react' }] }
    const src = `function Comp() { const [s, setS] = useState(0); return <div>{s}</div> }`
    const { code, map } = await runLoader(src, options, '/test/file.jsx')
    expect(code).toBe(`
import { useState } from 'react';
function Comp() { const [s, setS] = useState(0); return <div>{s}</div> }`)
    expect(map).toBeDefined()
    expect(map.sources).toEqual(['/test/file.jsx']) // sourcemap points to original file
  })

  it('replaces imports block correctly with comments preserved', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }, { name: 'computed', from: 'vue' }] }
    const src = `import 'existing'
// comment
import 'another'
const count = ref(0)
const doubled = computed(() => count * 2)`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import 'existing'
// comment
import 'another'

import { ref, computed } from 'vue';
const count = ref(0)
const doubled = computed(() => count * 2)`)
  })

  it('handles non-consecutive imports in TSX files', async () => {
    const options = { imports: [{ name: 'useState', from: 'react' }, { name: 'useEffect', from: 'react' }] }
    const src = `'use client'
import 'a'
// bar
import 'b'
/** foo */
import 'c'

function App() { const [s] = useState(0); useEffect(() => {}, []); return <div>{s}</div> }`
    const { code } = await runLoader(src, options, '/test/file.tsx')
    expect(code).toBe(`'use client'
import 'a'
// bar
import 'b'
/** foo */
import 'c'


import { useState, useEffect } from 'react';
function App() { const [s] = useState(0); useEffect(() => {}, []); return <div>{s}</div> }`)
  })

  it('handles multiline import statements', async () => {
    const options = { imports: [{ name: 'ref', from: 'vue' }] }
    const src = `import {
  Button
} from './button'
const app = ref(0)`
    const { code } = await runLoader(src, options)
    expect(code).toBe(`import {
  Button
} from './button'

import { ref } from 'vue';
const app = ref(0)`)
  })

  it('handles multiline import statements in JSX files', async () => {
    const options = { imports: [{ name: 'useState', from: 'react' }] }
    const src = `import {
  Button
} from './button'
function App() { const [count, setCount] = useState(0); return <Button>{count}</Button> }`
    const { code } = await runLoader(src, options, '/test/file.jsx')
    expect(code).toBe(`import {
  Button
} from './button'

import { useState } from 'react';
function App() { const [count, setCount] = useState(0); return <Button>{count}</Button> }`)
  })
})

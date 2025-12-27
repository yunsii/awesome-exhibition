import { defineConfig } from 'tsdown'

export default defineConfig({
  external: ['oxc-parser', '@babel/parser', '@babel/traverse'],
})

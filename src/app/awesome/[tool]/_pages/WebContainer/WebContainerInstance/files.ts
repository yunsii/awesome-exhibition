import dedent from 'dedent'

import type { FileSystemTree } from '@webcontainer/api'

export const files = {
  'index.js': {
    file: {
      contents: dedent`
        console.log("cwd", process.cwd())
      `,
    },
  },
  'package.json': {
    file: {
      contents: dedent`
        {
          "name": "hello-world",
          "type": "module",
          "dependencies": {
          },
          "scripts": {
            "start": "node index.js",
            "test": "node --print \"console.log('hello, world')\""
          }
        }
      `,
    },
  },
} satisfies FileSystemTree

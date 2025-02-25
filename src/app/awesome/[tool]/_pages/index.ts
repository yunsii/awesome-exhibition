'use client'

import { AwesomeTool } from '@/constants/tools'
import dynamic from 'next/dynamic'

const Cookies = dynamic(() => import('./Cookies'), {
  ssr: false,
})
const FastTextWasmJs = dynamic(() => import('./FastTextWasmJs'), { ssr: false })
const WebContainer = dynamic(() => import('./WebContainer'), { ssr: false })
const MlMatrix = dynamic(() => import('./MlMatrix'), { ssr: false })
const PathToRegexp = dynamic(() => import('./PathToRegexp'), {
  ssr: false,
})
const PromiseAllConditional = dynamic(() => import('./PromiseAllConditional'), {
  ssr: false,
})
const Sse = dynamic(() => import('./Sse'), {
  ssr: false,
})
const TransformersJs = dynamic(() => import('./TransformersJs'), {
  ssr: false,
})

const pages = {
  [AwesomeTool.Cookies]: Cookies,
  [AwesomeTool.FastTextWasmJs]: FastTextWasmJs,
  [AwesomeTool.WebContainer]: WebContainer,
  [AwesomeTool.MlMatrix]: MlMatrix,
  [AwesomeTool.PathToRegexp]: PathToRegexp,
  [AwesomeTool.PromiseAllConditional]: PromiseAllConditional,
  [AwesomeTool.Sse]: Sse,
  [AwesomeTool.TransformersJs]: TransformersJs,
}

export default pages

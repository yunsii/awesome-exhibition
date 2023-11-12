import dynamic from 'next/dynamic'

import { AwesomeTool } from '@/constants/tools'

const FastTextWasmJs = dynamic(() => import('./FastTextWasmJs'), { ssr: false })
const WebContainer = dynamic(() => import('./WebContainer'), { ssr: false })

const pages = {
  [AwesomeTool.FastTextWasmJs]: FastTextWasmJs,
  [AwesomeTool.WebContainer]: WebContainer,
}

export default pages

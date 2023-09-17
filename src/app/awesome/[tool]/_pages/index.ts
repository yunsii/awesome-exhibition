import dynamic from 'next/dynamic'

import { AwesomeTool } from '@/constants/tools'

const FastTextWasmJs = dynamic(() => import('./FastTextWasmJs'), { ssr: false })

const pages = {
  [AwesomeTool.FastTextWasmJs]: FastTextWasmJs,
}

export default pages

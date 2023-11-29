import dynamic from 'next/dynamic'

import { AwesomeTool } from '@/constants/tools'

const FastTextWasmJs = dynamic(() => import('./FastTextWasmJs'), { ssr: false })
const WebContainer = dynamic(() => import('./WebContainer'), { ssr: false })
const MlMatrix = dynamic(() => import('./MlMatrix'), { ssr: false })
const PromiseRaceConditionally = dynamic(
  () => import('./PromiseRaceConditionally'),
  { ssr: false },
)

const pages = {
  [AwesomeTool.FastTextWasmJs]: FastTextWasmJs,
  [AwesomeTool.WebContainer]: WebContainer,
  [AwesomeTool.MlMatrix]: MlMatrix,
  [AwesomeTool.PromiseRaceConditionally]: PromiseRaceConditionally,
}

export default pages

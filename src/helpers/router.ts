import type { AwesomeTool } from '@/constants/tools'

export function getToolHref(tool: AwesomeTool) {
  return `/awesome/${tool}`
}

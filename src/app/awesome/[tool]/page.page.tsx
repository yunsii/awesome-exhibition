import React from 'react'
import { notFound } from 'next/navigation'

import pages from './_pages'

import { AwesomeTool } from '@/constants/tools'

function check(tool: string): tool is AwesomeTool {
  return Object.values(AwesomeTool).includes(tool as any)
}

export default function Tool(props: { params: { tool: string } }) {
  const { params } = props
  const { tool } = params

  if (!check(tool)) {
    notFound()
  }

  return <div>{React.createElement(pages[tool])}</div>
}

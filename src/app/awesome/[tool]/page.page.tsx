'use client'

import { AwesomeTool } from '@/constants/tools'
import { notFound } from 'next/navigation'
import React from 'react'

import pages from './_pages'

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

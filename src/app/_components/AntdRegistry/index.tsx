'use client'

import React from 'react'
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import { useServerInsertedHTML } from 'next/navigation'

import type Entity from '@ant-design/cssinjs/es/Cache'

function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const cache = React.useMemo<Entity>(() => createCache(), [])
  useServerInsertedHTML(() => (
    // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
    <style
      id='antd'
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ))
  return <StyleProvider cache={cache}>{children}</StyleProvider>
}

export default StyledComponentsRegistry

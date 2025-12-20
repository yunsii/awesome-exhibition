'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import React from 'react'

function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  return <AntdRegistry>{children}</AntdRegistry>
}

export default StyledComponentsRegistry

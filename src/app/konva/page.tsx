'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const DynamicKonva = dynamic(() => import('./components/KonvaStudio'), {
  ssr: false,
})

export interface KonvaProps {
}

function Konva(props: KonvaProps) {
  return (
    <DynamicKonva />
  )
}

export default Konva

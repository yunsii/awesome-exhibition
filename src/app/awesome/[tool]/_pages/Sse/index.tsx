'use client'

import React from 'react'

import TestSse from './TestSse'

export interface ISseProps {}

const Sse: React.FC<ISseProps> = () => {
  return (
    <div className='px-4 pt-4'>
      <TestSse name='App Router SSE by ReadableStream' resource='/api/sse1' />
      <TestSse name='App Router SSE by TransformStream' resource='/api/sse2' />
      <TestSse name='Page Router SSE by setInterval' resource='/api/sse3' />
    </div>
  )
}

export default Sse

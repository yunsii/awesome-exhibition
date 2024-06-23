'use client'

import { Button } from 'antd'
import React, { useRef, useState } from 'react'

import { fetchSSE } from '@/helpers/requests/sse'

export interface ISseProps {}

const Sse: React.FC<ISseProps> = () => {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const sse1AbortRef = useRef<AbortController | null>(null)
  const sse2AbortRef = useRef<AbortController | null>(null)

  const handleSse1 = () => {
    setText1('')
    sse1AbortRef.current = new AbortController()
    fetchSSE('/api/sse1', {
      signal: sse1AbortRef.current.signal,
      onEvent: (event) => {
        setText1((prev) => {
          return prev += event.data
        })
      },
    })
  }

  const handleSse2 = () => {
    setText2('')
    sse2AbortRef.current = new AbortController()
    fetchSSE('/api/sse2', {
      signal: sse2AbortRef.current.signal,
      onEvent: (event) => {
        setText2((prev) => {
          return prev += event.data
        })
      },
    })
  }

  return (
    <div className='px-4 pt-4'>
      <div>
        <Button onClick={() => {
          handleSse1()
        }}
        >
          /api/sse1
        </Button>
        <Button onClick={() => {
          sse1AbortRef.current?.abort()
        }}
        >
          abort
        </Button>
      </div>
      <div>
        {text1}
      </div>
      <div>
        <Button onClick={() => {
          handleSse2()
        }}
        >
          /api/sse2
        </Button>
        <Button onClick={() => {
          sse2AbortRef.current?.abort()
        }}
        >
          abort
        </Button>
      </div>
      <div>
        {text2}
      </div>
    </div>
  )
}

export default Sse

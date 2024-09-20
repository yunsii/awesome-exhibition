import { Button } from 'antd'
import React, { useRef, useState } from 'react'

import { fetchSSE } from '@/helpers/requests/sse'

export interface TestSseProps {
  name: string
  resource: string
}

const TestSse: React.FC<TestSseProps> = (props) => {
  const { name, resource } = props

  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const sseAbortRef = useRef<AbortController | null>(null)

  const handleSse1 = () => {
    if (loading) {
      return
    }

    setLoading(true)
    setText('')
    sseAbortRef.current = new AbortController()
    fetchSSE(resource, {
      signal: sseAbortRef.current.signal,
      onEvent: (event) => {
        setText((prev) => {
          return prev += event.data
        })
      },
    }).finally(() => {
      setLoading(false)
    })
  }

  return (
    <div className='px-4 pt-4'>
      <div>{name}</div>
      <div>
        <Button
          loading={loading}
          onClick={() => {
            handleSse1()
          }}
        >
          {resource}
        </Button>
        <Button onClick={() => {
          sseAbortRef.current?.abort()
        }}
        >
          abort
        </Button>
      </div>
      <div>
        {text}
      </div>
    </div>
  )
}

export default TestSse

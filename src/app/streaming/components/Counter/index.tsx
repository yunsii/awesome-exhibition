'use client'

import { Button } from 'antd'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-cyan-400 p-4'>
      <div>
        Count:
        {count}
      </div>
      <div>
        <Button onClick={() => {
          setCount(count + 1)
        }}
        >
          +1
        </Button>
      </div>
    </div>
  )
}

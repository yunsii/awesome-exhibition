'use client'

import { useToolName } from '@/hooks/tools'
import { Button, Input } from 'antd'
import { inverse, Matrix } from 'ml-matrix'
import { useState } from 'react'

function dump(matrix: number[][]) {
  return matrix
    .map((item) => {
      return item.join(', ')
    })
    .join('\n')
}
function load(matrix: string) {
  return matrix.split('\n').map((item) => {
    return item.split(',').map(Number)
  })
}

const MlMatrix: React.FC = () => {
  const toolName = useToolName()
  const [matrixStr, setMatrixStr] = useState(
    dump([
      [1, 0.8, 0],
      [0.2, 1, 0],
      [0, 0, 1],
    ]),
  )
  const [matrixStrResult, setMatrixStrResult] = useState('')

  return (
    <div className='px-4 pt-4'>
      <ToolTitle name={toolName} githubHref='https://github.com/mljs/matrix' />
      <div className='flex gap-4'>
        <Input.TextArea
          className='flex-1'
          rows={10}
          value={matrixStr}
          onChange={(event) => {
            setMatrixStr(event.target.value)
          }}
        />
        <Input.TextArea className='flex-1' rows={10} value={matrixStrResult} />
      </div>
      <div className='mt-4'>
        <Button
          onClick={() => {
            const A = new Matrix(load(matrixStr))
            const inverseA = inverse(A)
            setMatrixStrResult(dump(inverseA.to2DArray()))
          }}
        >
          Inverse
        </Button>
      </div>
    </div>
  )
}

export default MlMatrix

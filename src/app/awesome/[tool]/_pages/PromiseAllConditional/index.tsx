'use client'

/* eslint-disable no-console */
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Button, Input, Spin } from 'antd'

import { NotFoundError, got } from '@/helpers/mock'
import { pConditional } from '@/helpers/promises'

const pThrowError = pConditional.throwErrorHelper(Error, console.log)

const pThrow404 = pConditional.throwErrorHelper(NotFoundError, console.log)

const pFallback = pConditional.fallbackHelper((err) => {
  console.log(err)
  console.log('Use default value instead.')
})

const ERROR_DELAYS_DEFAULT_VALUE = [0, 0, 0, 0]
const ERROR_DELAYS_THROW_ERROR_VALUE = [0, 500, 0, 0]
const ERROR_DELAYS_FALLBACK_VALUE = [0, 0, 500, 0]

export interface IPromiseAllConditionallyProps {}

const PromiseAllConditionally: React.FC<IPromiseAllConditionallyProps> = () => {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>()
  const latestErrorDelays = useRef(ERROR_DELAYS_DEFAULT_VALUE)
  const [errorDelays, setErrorDelays] = useState<number[]>(
    latestErrorDelays.current,
  )

  const runTasks = async () => {
    setLoading(true)
    try {
      const results = await Promise.all([
        pThrowError(() =>
          got(
            { a: 1, wrapper: 'throwError' },
            { errorDelay: latestErrorDelays.current[0] },
          ),
        )({
          fallbackMessage: '{ a: 1 } not found',
        }),
        pThrow404(() =>
          got(
            { b: 2, wrapper: 'throw404' },
            { errorDelay: latestErrorDelays.current[1] },
          ),
        )({
          fallbackMessage: '{ b: 2 } not found',
        }),
        pFallback(() =>
          got(
            { c: 3, wrapper: 'fallback' },
            { errorDelay: latestErrorDelays.current[2] },
          ),
        )({
          defaultValue: { c: 0, wrapper: 'fallback' },
        }),
        pFallback(() =>
          got(
            { d: 4, wrapper: 'fallback' },
            { errorDelay: latestErrorDelays.current[3] },
          ),
        )({
          defaultValue: null,
        }),
      ])
      setResults(results)
      setError(null)
    }
    catch (err) {
      console.log(err)
      setResults([])
      setError(err)
    }
    setLoading(false)
  }

  const handleChangeErrorDelays = (delays: number[]) => {
    setErrorDelays(delays)
    latestErrorDelays.current = delays
  }

  useEffect(() => {
    runTasks()
  }, [])

  return (
    <div className='px-4 pt-4'>
      <div className='flex items-center gap-x-2 mb-2'>
        Error delays
        <Input
          className='max-w-xs'
          placeholder='Error delays'
          value={errorDelays.join(',')}
          onChange={(event) => {
            const nextErrorDelays = event.target.value
              .split(',')
              .map(Number)
              .filter((item) => typeof item === 'number') as number[]
            handleChangeErrorDelays(nextErrorDelays)
          }}
        />
        <Button onClick={() => runTasks()}>Run</Button>
      </div>
      <div className='flex gap-2 mb-2'>
        <Button
          onClick={() => {
            handleChangeErrorDelays(ERROR_DELAYS_DEFAULT_VALUE)
            runTasks()
          }}
        >
          Reset error delays
        </Button>
        <Button
          onClick={() => {
            handleChangeErrorDelays(ERROR_DELAYS_FALLBACK_VALUE)
            runTasks()
          }}
        >
          Set error delays to use fallback default value
        </Button>
        <Button
          onClick={() => {
            handleChangeErrorDelays(ERROR_DELAYS_THROW_ERROR_VALUE)
            runTasks()
          }}
        >
          Set error delays to throw error
        </Button>
      </div>
      {!!error && (
        <Alert type='error' message='Error ocurred, please check in console.' />
      )}
      <Spin spinning={loading}>
        <div className='whitespace-pre'>
          {JSON.stringify(results, null, 2)}
        </div>
      </Spin>
    </div>
  )
}

export default PromiseAllConditionally

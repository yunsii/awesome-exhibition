'use client'

/* eslint-disable no-console */
import React, { useRef, useState } from 'react'
import { Alert, Button, Input, Spin } from 'antd'

import { NotFoundError, got } from '@/helpers/mock'
import { fallback, throwErrorHelper } from '@/helpers/promises'

const throwError = throwErrorHelper(Error)

const throw404 = throwErrorHelper(NotFoundError)

const ERROR_DELAYS_DEFAULT_VALUE = [0, 0, 0, 0]
const ERROR_DELAYS_THROW_ERROR_VALUE = [0, 500, 0, 0]
const ERROR_DELAYS_FALLBACK_VALUE = [0, 0, 500, 0]

export interface IPromiseRaceConditionallyProps {}

const PromiseRaceConditionally: React.FC<
  IPromiseRaceConditionallyProps
> = () => {
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
        throwError(() =>
          got(
            { a: 1, wrapper: 'throwError' },
            { errorDelay: latestErrorDelays.current[0] },
          ),
        )({
          fallbackMessage: '{ a: 1 } not found',
        }),
        throw404(() =>
          got(
            { b: 2, wrapper: 'throw404' },
            { errorDelay: latestErrorDelays.current[1] },
          ),
        )({
          fallbackMessage: '{ b: 2 } not found',
        }),
        fallback(() =>
          got(
            { c: 3, wrapper: 'fallback' },
            { errorDelay: latestErrorDelays.current[2] },
          ),
        )({
          defaultValue: { c: 0, wrapper: 'fallback' },
          onError: (err) => {
            console.log(err)
            console.log(`use default value instead.`)
          },
        }),
        fallback(() =>
          got(
            { d: 4, wrapper: 'fallback' },
            { errorDelay: latestErrorDelays.current[3] },
          ),
        )({
          defaultValue: null,
          onError: (err) => {
            console.log(err)
            console.log(`use default value instead.`)
          },
        }),
      ])
      setResults(results)
      setError(null)
    } catch (err) {
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

  return (
    <div className='px-4 pt-4'>
      <div className={`flex gap-2 mb-2`}>
        <Input
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
        <div className={`whitespace-pre`}>
          {JSON.stringify(results, null, 2)}
        </div>
      </Spin>
    </div>
  )
}

export default PromiseRaceConditionally

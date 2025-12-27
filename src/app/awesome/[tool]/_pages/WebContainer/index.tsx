'use client'

import { useToolName } from '@/hooks/tools'
import { useAsyncEffect, useDebounceEffect, useUnmount } from 'ahooks'
import { Input } from 'antd'
import { useState } from 'react'

import { WebContainerInstance } from './WebContainerInstance'
import { files } from './WebContainerInstance/files'

const WebContainerRuntime: React.FC = () => {
  const toolName = useToolName()
  const [ready, setReady] = useState(false)
  const [code, setCode] = useState(files['index.js'].file.contents)
  const [output, setOutput] = useState('')

  const clearOutput = () => {
    setOutput('')
  }

  useUnmount(() => {
    clearOutput()
  })

  useAsyncEffect(async () => {
    try {
      setOutput('Loading...')
      await WebContainerInstance.getInstance()

      const exitCode = await WebContainerInstance.installDependencies()
      if (exitCode !== 0) {
        throw new Error('Installation failed')
      }
      setReady(true)
    } catch (error) {
      console.error('Error initializing WebContainer:', error)
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [])

  useDebounceEffect(() => {
    if (!ready) {
      return
    }
    const run = async () => {
      await WebContainerInstance.writeIndexJS(code)
      await WebContainerInstance.runStart({
        onWrite(chunk) {
          setOutput((prevOutput) => {
            return `${prevOutput}${chunk}`
          })
        },
      })
    }

    clearOutput()
    run()
  }, [ready, code])

  return (
    <div className='px-4 pt-4'>
      <ToolTitle
        name={toolName}
        githubHref='https://github.com/stackblitz/webcontainer-core'
      />
      <div className='flex gap-4'>
        <Input.TextArea
          className='flex-1'
          rows={10}
          value={code}
          onChange={(event) => {
            setCode(event.target.value)
          }}
        />
        <Input.TextArea className='flex-1' rows={10} value={output} />
      </div>
    </div>
  )
}

export default WebContainerRuntime

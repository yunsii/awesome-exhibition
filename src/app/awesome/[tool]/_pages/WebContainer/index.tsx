'use client'

import { Input } from 'antd'
import { useAsyncEffect, useDebounceEffect, useUnmount } from 'ahooks'
import { useState } from 'react'

import ToolTitle from '@/app/_components/ToolTitle'
import { useToolName } from '@/hooks/tools'

import { files } from './WebContainerInstance/files'
import { WebContainerInstance } from './WebContainerInstance'

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
    setOutput('Loading...')
    await WebContainerInstance.getInstance()

    const exitCode = await WebContainerInstance.installDependencies()
    if (exitCode !== 0) {
      throw new Error('Installation failed')
    }
    setReady(true)
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

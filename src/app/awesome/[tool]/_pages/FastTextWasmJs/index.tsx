'use client'

import React, { useState } from 'react'
import { Alert, Form, Input } from 'antd'
import { useDebounceFn, useMount } from 'ahooks'
import { getLIDModel } from 'fasttext.wasm.js/common'

import { useToolName } from '@/hooks/tools'
import ToolTitle from '@/app/_components/ToolTitle'

interface Values {
  input: string
}

const initialValues: Values = {
  input: 'How are you?',
}

const FastTextWasmJs: React.FC = () => {
  const toolName = useToolName()
  const [lang, setLang] = useState<string>()
  const [possibility, setPossibility] = useState<number>()
  const [loading, setLoading] = useState(false)

  const identified = lang && !loading

  const handleDetect = useDebounceFn(async (values: Values) => {
    setLoading(true)
    const lidModel = await getLIDModel()
    await lidModel.load()
    const result = await lidModel.identify(values.input, 10)
    // eslint-disable-next-line no-console
    console.log('result', JSON.stringify(result, null, 2))

    setLang(result[0].alpha3)
    setPossibility(result[0].possibility)
    setLoading(false)
  })

  useMount(() => {
    handleDetect.run(initialValues)
  })

  return (
    <div className='p-4'>
      <ToolTitle
        name={toolName}
        githubHref='https://github.com/yunsii/fasttext.wasm.js'
      />

      <Form<Values>
        initialValues={initialValues}
        onValuesChange={(values) => {
          handleDetect.run(values)
        }}
      >
        <Form.Item name='input'>
          <Input.TextArea rows={8} />
        </Form.Item>
      </Form>
      <Alert
        message={
          identified
            ? (
              <div>
                <span>Identify Lang:</span>
                {' '}
                <span className='font-bold'>{lang?.toUpperCase()}</span>
                {' '}
                with
                possibility
                {' '}
                {possibility}
              </div>
              )
            : (
              <div>Identifying...</div>
              )
        }
        type={identified ? 'success' : 'info'}
      />
    </div>
  )
}

export default FastTextWasmJs

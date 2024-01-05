'use client'

import React, { useState } from 'react'
import { Alert, Form, Input } from 'antd'
import {
  LanguageIdentificationModel,
  initializeFastTextModule,
} from 'fasttext.wasm.js/common'
import { useDebounceFn, useMount } from 'ahooks'

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
  const [loading, setLoading] = useState(false)

  const identified = lang && !loading

  const handleDetect = useDebounceFn(async (values: Values) => {
    setLoading(true)
    await initializeFastTextModule({
      locateFile: (url, scriptDir) => {
        // eslint-disable-next-line no-console
        console.log(
          '🚀 ~ file: index.tsx:36 ~ handleDetect ~ url, scriptDir:',
          url,
          scriptDir,
        )
        return `/${url}`
      },
    })
    const model = new LanguageIdentificationModel({
      // Specific model path under public dir,
      // You can download it from https://fasttext.cc/docs/en/language-identification.html
      modelHref: '/models/lid.176.ftz',
    })
    await model.load()
    const result = await model.identifyVerbose(values.input)
    // eslint-disable-next-line no-console
    console.log('result', JSON.stringify(result, null, 2))
    setLang(result[0].lang)
    setLoading(false)
  })

  useMount(() => {
    handleDetect.run(initialValues)
  })

  return (
    <div className={`p-4`}>
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
          identified ? (
            <div>
              <span>Identify Lang: </span>
              <span className={`font-bold`}>{lang?.toUpperCase()}</span>
            </div>
          ) : (
            <div>Identifying...</div>
          )
        }
        type={identified ? 'success' : 'info'}
      />
    </div>
  )
}

export default FastTextWasmJs

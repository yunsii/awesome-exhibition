'use client'

import { getErrorMessage } from '@/helpers/error'
import { toRegExpString } from '@/helpers/regexp'
import { Button, Divider, Form, Input, Radio, Switch } from 'antd'
import { match, pathToRegexp } from 'path-to-regexp'
import React from 'react'

import type { TupleToUnion } from 'type-fest'

import { DECODE_OPTIONS, ENCODE_OPTIONS } from './constants'

export interface IPathToRegExpFormValues {
  path: string
  testPath?: string
  sensitive?: boolean
  strict?: boolean
  end?: boolean
  start?: boolean
  delimiter?: string
  endsWith?: string
  encode?: TupleToUnion<typeof ENCODE_OPTIONS>
  prefixes?: string

  /** Match only */
  decode?: TupleToUnion<typeof DECODE_OPTIONS>
}

const defaultValues: IPathToRegExpFormValues = {
  path: '/foo/:bar',
  sensitive: false,
  strict: false,
  end: true,
  start: true,
  delimiter: '/#?',
  prefixes: './',
}

export interface PathToRegExpProps {}

const PathToRegExp: React.FC<PathToRegExpProps> = () => {
  const [form] = Form.useForm<IPathToRegExpFormValues>()

  return (
    <div className='px-4 pt-4'>
      <Form<IPathToRegExpFormValues>
        initialValues={defaultValues}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          name='path'
          label='Path'
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name='testPath' label='Test Path'>
          <Input />
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item name='sensitive' label='Sensitive' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='strict' label='Strict' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='end' label='End' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='start' label='Start' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='delimiter' label='Delimiter'>
          <Input />
        </Form.Item>
        <Form.Item name='endsWith' label='Ends With'>
          <Input />
        </Form.Item>
        <Form.Item name='encode' label='Encode'>
          <Radio.Group>
            {ENCODE_OPTIONS.map((item) => {
              return (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              )
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name='decode' label='Decode' extra={<em>Match only</em>}>
          <Radio.Group>
            {DECODE_OPTIONS.map((item) => {
              return (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              )
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name='prefixes' label='Prefixes'>
          <Input />
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button
            onClick={() => {
              form.resetFields()
            }}
          >
            Reset
          </Button>
        </Form.Item>
        <div className='flex flex-wrap gap-4'>
          <Form.Item<IPathToRegExpFormValues> noStyle shouldUpdate>
            {(form) => {
              const values = form.getFieldsValue()
              const { path, testPath, encode, ...restOptions } = values

              if (!path) {
                return <em>No path provided.</em>
              }

              let internalEncode: ((value: string) => string) | undefined
              if (encode === 'encodeURI') {
                internalEncode = encodeURI
              }
              if (encode === 'encodeURIComponent') {
                internalEncode = encodeURIComponent
              }

              let regexp: RegExp

              try {
                const { regexp, keys } = pathToRegexp(path, {
                  ...restOptions,
                  encodePath: internalEncode,
                })
                const execResult = regexp.exec(testPath || '')
                return (
                  <div>
                    <h2 className='font-bold'>
                      <code>pathToRegexp(path)</code>
                    </h2>
                    <div className='flex gap-x-2'>
                      <em>Literal notation</em>
                      <code>{toRegExpString(regexp)}</code>
                    </div>
                    <div className='flex gap-x-2'>
                      <em>Keys</em>
                      <code className='whitespace-pre'>
                        {JSON.stringify(keys, null, 2)}
                      </code>
                    </div>
                    {testPath && (
                      <div className='flex gap-x-2'>
                        <em>Exec result</em>
                        {execResult === null
                          ? (
                              <code>null</code>
                            )
                          : (
                              <code className='whitespace-pre'>
                                {JSON.stringify(execResult)}
                              </code>
                            )}
                      </div>
                    )}
                  </div>
                )
              } catch (err) {
                return <div className='text-red-500'>{getErrorMessage(err)}</div>
              }
            }}
          </Form.Item>
          <Form.Item<IPathToRegExpFormValues> noStyle shouldUpdate>
            {(form) => {
              const values = form.getFieldsValue()
              const { path, testPath, encode, decode, ...restOptions } = values

              if (!path) {
                return <em>No path provided.</em>
              }
              if (!testPath) {
                return <em>No test path provided.</em>
              }

              let internalEncode: ((value: string) => string) | undefined
              if (encode === 'encodeURI') {
                internalEncode = encodeURI
              }
              if (encode === 'encodeURIComponent') {
                internalEncode = encodeURIComponent
              }
              let internalDecode: ((value: string) => string) | undefined
              if (decode === 'decodeURI') {
                internalEncode = decodeURI
              }
              if (decode === 'decodeURIComponent') {
                internalEncode = decodeURIComponent
              }

              const urlMatch = match(path, {
                ...restOptions,
                encodePath: internalEncode,
                decode: internalDecode,
              })
              return (
                <div>
                  <h2 className='font-bold'>
                    <code>match(path)</code>
                  </h2>
                  {testPath && (
                    <div className='flex gap-x-2'>
                      <em>Exec result</em>
                      <code className='whitespace-pre'>
                        {JSON.stringify(urlMatch(testPath), null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              )
            }}
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default PathToRegExp

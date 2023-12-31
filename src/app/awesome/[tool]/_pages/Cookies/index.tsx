'use client'

import React, { useRef, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  message,
} from 'antd'
import cookie from 'cookie'
import { useUpdate } from 'ahooks'

import type { TupleToUnion } from 'type-fest'
import type { InputRef } from 'antd'

export const COOKIE_PREFIX = '_AWESOME_'

export const PRESERVED_PREFIXES = ['__Secure-', '__Host-', 'None'] as const

export interface ICookieFormValues extends cookie.CookieSerializeOptions {
  name: string
  value: string

  preservedPrefix?: TupleToUnion<typeof PRESERVED_PREFIXES>
  useApi?: boolean
}

export interface IPromiseAllConditionallyProps {}

const PromiseAllConditionally: React.FC<IPromiseAllConditionallyProps> = () => {
  const update = useUpdate()

  const [form] = Form.useForm<ICookieFormValues>()
  const selectInputRef = useRef<InputRef>(null)

  const rawCookies = cookie.parse(document.cookie)
  const awesomeCookies = Object.keys(rawCookies)
    .filter((item) => item.includes(COOKIE_PREFIX))
    .reduce((previous, current) => {
      return {
        ...previous,
        [current]: rawCookies[current],
      }
    }, {})
  const [cookieNames, setCookieNames] = useState(() => {
    return Object.keys(awesomeCookies)
  })
  const [newCookieName, setNewCookieName] = useState('')

  const handleSetCookie = async (values: ICookieFormValues) => {
    const { name, value, useApi, preservedPrefix, ...options } = values
    let internalName = name.startsWith(COOKIE_PREFIX)
      ? name
      : `${COOKIE_PREFIX}${name}`
    internalName =
      !preservedPrefix || preservedPrefix === 'None'
        ? internalName
        : `${preservedPrefix}${internalName}`
    const cookieSerialized = cookie.serialize(
      internalName,
      value ?? '',
      options,
    )

    if (useApi) {
      // eslint-disable-next-line no-console
      console.log('[💎 Server] cookieSerialized:', cookieSerialized)
      const axios = (await import('axios')).default
      axios.post('/api/cookie', cookieSerialized)
    } else {
      // eslint-disable-next-line no-console
      console.log('[📍 Client] cookieSerialized:', cookieSerialized)
      document.cookie = cookieSerialized
    }

    update()
  }

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    e.preventDefault()

    if (!newCookieName.trim()) {
      message.error('Unexpected falsy new cookie name')
    }

    const internalNewCookieName = `${COOKIE_PREFIX}${newCookieName}`
    setCookieNames([...cookieNames, internalNewCookieName])
    setNewCookieName('')
    form.setFieldValue('name', internalNewCookieName)
    setTimeout(() => {
      selectInputRef.current?.focus()
    }, 0)
  }

  return (
    <div className='px-4 pt-4'>
      <Form
        form={form}
        onFinish={handleSetCookie}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      >
        <Form.Item
          name='name'
          label='Name'
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={cookieNames.map((item) => ({ label: item, value: item }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Input
                    placeholder='Please enter new cookie name'
                    ref={selectInputRef}
                    prefix={COOKIE_PREFIX}
                    value={newCookieName}
                    onChange={(event) => {
                      setNewCookieName(event.target.value)
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button type='text' onClick={addItem}>
                    Add item
                  </Button>
                </Space>
              </>
            )}
          />
        </Form.Item>
        <Form.Item name='value' label='Value'>
          <Input />
        </Form.Item>
        <Form.Item name='domain' label='Domain'>
          <Input />
        </Form.Item>
        <Form.Item name='path' label='Path'>
          <Input />
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            return (
              <Form.Item name='maxAge' label='Max Age'>
                <InputNumber
                  min={-1}
                  step={form.getFieldValue('maxAge') < 0 ? 1 : 1000}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item name='httpOnly' label='Http Only' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='secure' label='Secure' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='sameSite' label='Same Site'>
          <Select
            options={[true, false, 'lax', 'strict', 'none'].map((item) => {
              return {
                value: item,
                label: item.toString(),
              }
            })}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name='partitioned'
          label='Partitioned'
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
        <Form.Item name='priority' label='Priority'>
          <Select
            options={['low', 'medium', 'high'].map((item) => {
              return {
                value: item,
                label: item,
              }
            })}
            allowClear
          />
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item
          name='preservedPrefix'
          label='Preserved Prefix'
          extra={
            <ul className='list-disc'>
              <li>
                <em>
                  No{' '}
                  <a
                    href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent'
                    target='_blank'
                    rel='noreferrer'
                  >
                    preserved prefix
                  </a>{' '}
                  will be used by default
                </em>
              </li>
              <li>
                <em>
                  <a
                    href='https://datatracker.ietf.org/doc/html/draft-west-cookie-prefixes-05#section-3'
                    rel='noreferrer'
                  >
                    Prefix additional rules
                  </a>
                </em>
              </li>
            </ul>
          }
        >
          <Radio.Group>
            {PRESERVED_PREFIXES.map((item) => {
              return (
                <Radio key={item} value={item}>
                  {item}
                </Radio>
              )
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name='useApi' label='Use api' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 14 }} shouldUpdate>
          {(form) => {
            const danger = form.getFieldValue('maxAge') <= 0
            return (
              <Button htmlType='submit' type='primary' danger={danger}>
                {danger ? 'Remove cookie' : 'Set cookie'}
              </Button>
            )
          }}
        </Form.Item>
      </Form>

      <div>{JSON.stringify(awesomeCookies, null, 2)}</div>
    </div>
  )
}

export default PromiseAllConditionally

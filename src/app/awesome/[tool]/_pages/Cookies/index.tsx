'use client'

import React, { useRef, useState } from 'react'
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
  message,
} from 'antd'
import cookie from 'cookie'
import { useUpdate } from 'ahooks'

import type { InputRef } from 'antd'

export const COOKIE_PREFIX = '_AWESOME_'

export interface ICookieFormValues extends cookie.CookieSerializeOptions {
  name: string
  value: string

  createByApi?: boolean
}

export interface IPromiseAllConditionallyProps {}

const PromiseAllConditionally: React.FC<IPromiseAllConditionallyProps> = () => {
  const update = useUpdate()

  const [form] = Form.useForm<ICookieFormValues>()
  const selectInputRef = useRef<InputRef>(null)

  const rawCookies = cookie.parse(document.cookie)
  const awesomeCookies = Object.keys(rawCookies)
    .filter((item) => item.startsWith(COOKIE_PREFIX))
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
    const { name, value, createByApi, ...options } = values
    const cookieSerialized = cookie.serialize(
      name.startsWith(COOKIE_PREFIX) ? name : `${COOKIE_PREFIX}${name}`,
      value ?? '',
      options,
    )

    if (createByApi) {
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
        <Form.Item name='maxAge' label='Max Age'>
          <InputNumber min={-1} step={1000} />
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
          name='createByApi'
          label='Create by api'
          valuePropName='checked'
          extra={<em>No cookies will be created by api by default.</em>}
        >
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
          <Button htmlType='submit' type='primary'>
            Set cookie
          </Button>
        </Form.Item>
      </Form>

      <div>{JSON.stringify(awesomeCookies, null, 2)}</div>
    </div>
  )
}

export default PromiseAllConditionally

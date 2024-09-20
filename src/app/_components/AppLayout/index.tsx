'use client'

import { Button, Layout, Menu } from 'antd'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { AwesomeTool } from '../../../constants/tools'

import { getToolHref } from '@/helpers/router'

export interface AppLayoutProps {
  children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const { children } = props
  const pathname = usePathname()

  return (
    <main className='h-screen'>
      <Layout className='w-full h-full' hasSider>
        <Layout.Sider theme='light'>
          <div className='flex flex-col h-full'>
            <h1
              className='text-center py-3 font-bold text-lg bg-clip-text bg-cover text-transparent'
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)',
              }}
            >
              Awesome Exhibition
            </h1>

            <div className='flex-1'>
              <Menu
                selectedKeys={pathname ? [pathname] : []}
                items={[
                  {
                    key: '/',
                    label: <Link href='/'>Introduce</Link>,
                  },
                  {
                    key: '/streaming',
                    label: <Link href='/streaming'>Streaming Page</Link>,
                  },
                  {
                    key: '/awesome-tools',
                    label: 'Awesome Tools',
                    children: Object.keys(AwesomeTool).map((item) => {
                      const key = item as keyof typeof AwesomeTool
                      return {
                        key: getToolHref(AwesomeTool[key]),
                        label: (
                          <Link href={getToolHref(AwesomeTool[key])}>
                            {AwesomeTool[key]}
                          </Link>
                        ),
                        title: AwesomeTool[key],
                      }
                    }),
                  },
                ]}
              />
            </div>
            <div className='px-1 pb-1'>
              <a
                href='https://github.com/yunsii/awesome-exhibition'
                target='_blank'
                rel='noreferrer'
              >
                <Button
                  block
                  className='flex h-8 gap-x-2'
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <span className='i-mdi--github' />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
        </Layout.Sider>
        <Layout className='max-h-screen overflow-auto'>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Layout>
    </main>
  )
}

export default AppLayout

import { siteData } from '@/constants/site'
import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import AntdRegistry from './_components/AntdRegistry'
import AppLayout from './_components/AppLayout'

import './globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: siteData.name,
  description: 'Awesome exhibition for awesome tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AntdRegistry>
          <AppLayout>{children}</AppLayout>
        </AntdRegistry>
      </body>
    </html>
  )
}

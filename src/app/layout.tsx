import './globals.scss'
import { Inter } from 'next/font/google'

import StyledComponentsRegistry from './_components/AntdRegistry'
import AppLayout from './_components/AppLayout'

import type { Metadata } from 'next'

import { siteData } from '@/constants/site'

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
        <StyledComponentsRegistry>
          <AppLayout>{children}</AppLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

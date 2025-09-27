import RouterNavigation from '@/components/router-navigation'

import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <RouterNavigation />
    </>
  )
}

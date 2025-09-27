import { useRouter } from 'next/router'
import React from 'react'

import {
  useMountRouterPrefetch,
  useMountRouterPush,
  useMountRouterReload,
  useMountRouterReplace,
} from './global-handler'

export interface RouterNavigationProps {
}

function RouterNavigation(props: RouterNavigationProps) {
  const router = useRouter()

  useMountRouterPush(router.push)
  useMountRouterReplace(router.replace)
  useMountRouterReload(router.reload)
  useMountRouterPrefetch(router.prefetch)

  return <></>
}

export default RouterNavigation

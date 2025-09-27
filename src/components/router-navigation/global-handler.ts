import { createGlobalHandler } from '@/helpers/window/handler'

import type { NextRouter } from 'next/router'

export const [useMountRouterPush, callRouterPush] = createGlobalHandler<NextRouter['push']>()
export const [useMountRouterReplace, callRouterReplace] = createGlobalHandler<NextRouter['replace']>()
export const [useMountRouterReload, callRouterReload] = createGlobalHandler<NextRouter['reload']>()
export const [useMountRouterPrefetch, callRouterPrefetch] = createGlobalHandler<NextRouter['prefetch']>()

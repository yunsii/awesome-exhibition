import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import type { Promisable, TupleToUnion } from 'type-fest'

export const supportedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const

export type SupportedMethod = TupleToUnion<typeof supportedMethods>

export type CreateNextApiCoreOptions<T = any> = Partial<Record<SupportedMethod, (
  req: NextApiRequest,
  res: NextApiResponse<T>,
) => Promisable<unknown>>>

/**
 * Support methods: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods
 */
export function createNextApi<T = any>(
  coreOptions: CreateNextApiCoreOptions<T>,
) {
  const internalHandler: NextApiHandler<T> = async (req, res) => {
    const method = req.method as SupportedMethod | undefined

    if (!method || !supportedMethods.includes(method)) {
      res.status(405).end()
      return
    }

    const targetCallback = coreOptions[method]

    if (!targetCallback) {
      res.status(405).end()
      return
    }

    await targetCallback(req, res)
  }

  return internalHandler
}

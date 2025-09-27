import { callRouterPush } from '@/components/router-navigation/global-handler'
import { useRouter } from 'next/router'
import { memo, useRef, useState } from 'react'

import type { GetServerSidePropsContext } from 'next'
import type { NextRouter } from 'next/router'

interface InternalItemProps {
  id: string | number
  onPush: (url: string, as?: string, options?: Parameters<NextRouter['push']>[2]) => Promise<boolean>
}

function InternalItem(props: InternalItemProps) {
  const { id, onPush } = props

  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div>
      <h2>
        Item
        {id}
        {' '}
        (rendered
        {' '}
        {renderCountRef.current}
        {' '}
        times)
      </h2>
      <button
        type='button'
        onClick={() => onPush(`/use-router/${id}`)}
      >
        View Details
      </button>
      <button
        type='button'
        onClick={() => onPush(`/use-router/${id}`, undefined, { shallow: true })}
      >
        View Details (Shallow)
      </button>
    </div>
  )
}

const ItemWithUseRouter = memo((props: Omit<InternalItemProps, 'onPush'>) => {
  const router = useRouter()
  return <InternalItem {...props} onPush={router.push} />
})

const ItemWithCallRouterPush = memo((props: Omit<InternalItemProps, 'onPush'>) => {
  return <InternalItem {...props} onPush={callRouterPush} />
})

export default function UseRouterPage(props: { slug: string[] }) {
  const { slug } = props

  const [routerMethod, setRouterMethod] = useState<'use-router-push' | 'call-router-push'>('call-router-push')

  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  const ItemComponent = routerMethod === 'use-router-push' ? ItemWithUseRouter : ItemWithCallRouterPush

  return (
    <div>
      <h1>
        Use Router Example (rendered
        {' '}
        {renderCountRef.current}
        {' '}
        times)
      </h1>
      <div>
        Router Method:
        <button
          type='button'
          disabled={routerMethod === 'use-router-push'}
          onClick={() => setRouterMethod('use-router-push')}
        >
          useRouter().push
        </button>
        <button
          type='button'
          disabled={routerMethod === 'call-router-push'}
          onClick={() => setRouterMethod('call-router-push')}
        >
          callRouterPush
        </button>
      </div>
      <div>
        Current Slug:
        {' '}
        {slug.length > 0 ? slug.join(' / ') : '(none)'}
      </div>
      {Array.from({ length: 30 }).map((_, i) => i + 1).map((id) => {
        return (
          <ItemComponent key={id} id={id} />
        )
      })}
    </div>
  )
}

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const slug = ctx.params?.slug

  return {
    props: {
      slug: Array.isArray(slug) ? slug : slug ? [slug] : [],
    },
  }
}

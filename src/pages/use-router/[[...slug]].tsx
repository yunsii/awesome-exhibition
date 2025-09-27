import { callRouterPush } from '@/components/router-navigation/global-handler'
import { memo, useRef } from 'react'

import type { GetServerSidePropsContext } from 'next'

function InternalItem({ id }: { id: string | number }) {
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
        onClick={() => callRouterPush(`/use-router/${id}`)}
      >
        View Details
      </button>
      <button
        type='button'
        onClick={() => callRouterPush(`/use-router/${id}`, undefined, { shallow: true })}
      >
        View Details (Shallow)
      </button>
    </div>
  )
}

const Item = memo(InternalItem)

export default function UseRouterPage(props: { slug: string[] }) {
  const { slug } = props

  // eslint-disable-next-line no-console
  console.log('props.slug', slug)

  const renderCountRef = useRef(0)
  renderCountRef.current += 1

  return (
    <div>
      <h1>
        Use Router Example (rendered
        {' '}
        {renderCountRef.current}
        {' '}
        times)
      </h1>
      {Array.from({ length: 30 }).map((_, i) => i + 1).map((id) => {
        return (
          <Item key={id} id={id} />
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

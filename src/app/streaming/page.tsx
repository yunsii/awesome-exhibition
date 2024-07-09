import { Suspense } from 'react'

import { Counter } from './components/Counter'
import Data from './components/Data'
import Loading from './loading'

export default async function Page() {
  return (
    <div className='bg-slate-300 p-4'>
      <h2>Hello, Streaming page!</h2>
      <Counter />
      <Suspense fallback={<Loading />}>
        <Data />
      </Suspense>
    </div>
  )
}

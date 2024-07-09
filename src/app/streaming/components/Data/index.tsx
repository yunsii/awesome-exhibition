import https from 'node:https'

import fetch from 'node-fetch'

// eslint-disable-next-line react-refresh/only-export-components
export const dynamic = 'force-dynamic'

// ref: https://github.com/node-fetch/node-fetch/issues/568#issuecomment-932200523
const agent = new https.Agent({
  rejectUnauthorized: false,
})

async function getData() {
  const result = fetch('https://hub.dummyapis.com/delay?seconds=5', {
    agent,
  })

  return result
}

export default async function Page() {
  const data = await getData()

  return (
    <div className='bg-orange-300 p-4'>{JSON.stringify(data)}</div>
  )
}

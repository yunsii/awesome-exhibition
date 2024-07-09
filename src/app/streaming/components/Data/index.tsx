import { setTimeout } from 'node:timers/promises'

async function getData() {
  await setTimeout(5000)

  return {
    ok: 1,
  }
}

export default async function Page() {
  const data = await getData()

  return (
    <div className='bg-orange-300 p-4'>{JSON.stringify(data)}</div>
  )
}

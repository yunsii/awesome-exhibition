export async function POST(request: Request) {
  const cookieSerialized = await request.text()

  const res = Response.json({
    'set-cookie': cookieSerialized,
  })

  res.headers.set('set-cookie', cookieSerialized)

  return res
}

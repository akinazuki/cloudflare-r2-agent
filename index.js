const jwt = require('jsonwebtoken')
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  try {
    const query = new URL(request.url).searchParams
    const if_none_match = request.headers.get('if-none-match')
    // const request_body = await request.json()
    if (!query.get('token')) {
      throw {
        code: 401,
        name: 'Unauthorized',
      }
    }
    const decoded = jwt.verify(query.get('token'), JWT_SECRET)
    const res = await MY_BUCKET.get(decoded.file)
    if (!res)
      throw { code: 404, name: 'ResourceNotFound' }
    if (if_none_match === res.etag) {
      return new Response('', {
        status: 304,
        headers: {
          'content-type': res.httpMetadata.contentType,
        },
      })
    }
    return new Response(res.body, {
      headers: {
        'Content-Length': res.size,
        'ETag': res.etag,
        'Cache-Control': 'max-age=31536000',
        'Content-Type': res.httpMetadata.contentType,
      },
    })
  }
  catch (error) {
    return MyResponse({
      error: error.name || 'ServerError',
      message: error.message,
    }, { status: error.code || 500, headers: { 'Content-Type': 'application/json' } })
  }
}
function MyResponse(_body, _options = {}) {
  const is_json = typeof _body === 'object'
  const body = is_json ? JSON.stringify(_body) : _body
  if (is_json) {
    if (!_options.headers)
      _options.headers = {}
    _options.headers['Content-Type'] = 'application/json'
  }
  const options = _options
  return new Response(body, options)
}

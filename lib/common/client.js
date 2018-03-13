const fetch = require('node-fetch')

module.exports = (serviceName) => {
  return async function (state) {
    const response = await fetch(state.req.url, state.req)
    state.res = {
      headers: response.headers.raw(),
      status: response.status
    }

    state.res.body = await response.text()

    const isJSON = (response.headers.get('content-type') || '').includes('application/json')

    if (isJSON && state.res.body) {
      state.res.body = JSON.parse(state.res.body)
    }

    if (!response.ok) {
      const httpError = new Error(`'${serviceName}' API Error: ${response.statusText}`)
      httpError.code = response.status
      httpError.source = serviceName
      httpError.state = state
      throw httpError
    }

    return state
  }
}

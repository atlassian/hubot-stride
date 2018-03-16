const config = require('../config')
const { format } = require('url')
const querystring = require('querystring')
const client = require('../client')('stride')
const moment = require('moment')

var globalToken = null

class Stride {
  constructor ({clientId, clientSecret, tokenUrl, apiUrl, audience, endpointParams}) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.tokenUrl = tokenUrl
    this.endpointParams = endpointParams
    this.apiUrl = apiUrl
    this.audience = audience
  }

  // async uploadFile (cloudId, conversationId, fileName, fileStream) {
  //   return this._fetch('uploadFile', {
  //     pathname: `/site/${cloudId}/conversation/${conversationId}/media`,
  //     query: {
  //       name: fileName
  //     }
  //   }, {
  //     method: 'POST',
  //     body: fileStream,
  //     headers: {
  //       'Content-Type': 'application/octet-stream'
  //     }
  //   })
  // }

  // async getUser (cloudId, userId) {
  //   return this._fetch('getUser', {
  //     pathname: `/scim/site/${cloudId}/Users/${userId}`
  //   }, { method: 'GET' })
  // }

  async sendMessage (cloudId, conversationId, doc, opts) {
    const fabricMsg = {
      body: doc
    }

    const res = await this._fetch('sendMessage', {
      pathname: `/site/${cloudId}/conversation/${conversationId}/message`
    }, { method: 'POST', body: fabricMsg })

    return res
  }

  async _makeAuthHeader (method, path, query) {
    if (!globalToken || moment().utc().unix() > globalToken.expiresAt) {
      globalToken = await this.getNewToken()
    }
    return `${globalToken.token_type} ${globalToken.access_token}`
  }

  async getNewToken () {
    const body = querystring.stringify({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience
    })

    const headers = {
      Authorization: null,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    }

    const token = await this._fetch('getNewToken', {
      pathname: `/oauth/token`,
      host: this.tokenUrl
    }, { method: 'POST', headers, body })

    token.expiresAt = moment().utc().unix() + token.expires_in - 10 // ffs
    return token
  }

  async _fetch (methodName, {host, pathname, query}, { method, body, headers } = {}) {
    const url = format({
      host: host || this.apiUrl,
      pathname,
      query
    })

    if (!method) {
      method = 'GET'
    }

    if (!headers) {
      headers = {
        'Content-Type': 'application/json'
      }
    }

    if (headers['Authorization'] === undefined) {
      headers.Authorization = await this._makeAuthHeader(method, pathname, query)
    }

    // strong check for undefined
    // cause body variable can be 'false' boolean value
    if (body !== undefined && headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body)
    }

    const state = {
      req: {
        method,
        headers,
        body,
        url
      },
      methodName
    }

    await client(state)

    return state.res.body
  }
}

module.exports = function () {
  const appConfig = config.get('stride')
  return new Stride({
    clientId: appConfig.clientId,
    clientSecret: appConfig.clientSecret,
    tokenUrl: 'https://auth.atlassian.com',
    apiUrl: 'https://api.atlassian.com',
    audience: 'api.atlassian.com'
  })
}

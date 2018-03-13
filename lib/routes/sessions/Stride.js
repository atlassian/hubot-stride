const Session = require('./Session')
const _ = require('lodash')
const bb = require('bluebird')
const jwt = bb.promisifyAll(require('jsonwebtoken'))
const config = require('../../common/config')
const qs = require('qs')
const clientSecret = config.get('stride').clientSecret

module.exports = class extends Session {
  async check (req, res, next) {
    try {
      const authHeader = req.headers.authorization || ''
      let token = req.query.jwt ||
          req.headers['x-acpt'] ||
          _.get(authHeader.match(/JWT\s(.+)/), '1', null)

      if (this.options.fromState) {
        let state = qs.parse(req.query.state)
        token = state.jwt
      }

      const decodedToken = jwt.verify(token, clientSecret)

      if (!decodedToken.context) {
        throw new Error('jwt.context missing')
      }

      if (!decodedToken.sub) {
        throw new Error('jwt.sub missing')
      }

      if (!decodedToken.iss) {
        throw new Error(`jwt.iss missing`)
      }

      if (decodedToken.context.resourceType !== 'conversation') {
        throw Error('jwt.body.context.resourceType != conversation')
      }

      if (!decodedToken.context.resourceId) {
        throw Error('jwt.body.context.resourceId missing')
      }

      if (!decodedToken.context.cloudId) {
        throw Error('jwt.body.context.cloudId missing')
      }

      const conversationId = decodedToken.context.resourceId
      const cloudId = decodedToken.context.cloudId
      const chatUserId = decodedToken.sub

      req.context.cloudId = cloudId
      req.context.conversationId = conversationId
      req.context.chatUserId = chatUserId
      req.context.token = token

      next()
    } catch (error) {
      req.logger.warning({
        msg: 'Chat session check error',
        err: error
      })

      res.status(401).json({error: {
        message: error.message,
        code: 'CHAT_AUTHENTICATION_FAILED'
      }})
    }
  }
}

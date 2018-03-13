const Session = require('./Session')
const _ = require('lodash')
const jwt = require('bluebird').promisifyAll(require('jsonwebtoken'))
const config = require('../../common/config')

module.exports = class extends Session {
  async check (req, res, next) {
    const clientSecret = config.get('stride').clientSecret

    const authHeader = req.headers.authorization || ''
    const token = req.query.jwt ||
      req.headers['x-acpt'] ||
      _.get(authHeader.match(/JWT\s(.+)/), '1', null) ||
      _.get(authHeader.match(/Bearer\s(.+)/), '1', null)

    try {
      const decodedToken = await jwt.verifyAsync(token, clientSecret)
      const chatUserId = decodedToken.sub

      if (decodedToken.context) {
        const conversationId = decodedToken.context.resourceId
        const cloudId = decodedToken.context.cloudId
        req.context.cloudId = cloudId
        req.context.conversationId = conversationId
        req.context.chatUserId = chatUserId
        req.context.token = token
      }

      next()
    } catch (error) {
      req.logger.warning({
        msg: 'Chat jwt check error',
        err: error
      })

      res.status(401).json({error: {
        message: error.message,
        code: 'CHAT_AUTHENTICATION_FAILED'
      }})
    }
  }
}

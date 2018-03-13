const Component = require('./Component')
const classes = require('../routes')
const services = require('../services')
const {get} = require('lodash')

module.exports =
  class extends Component {
    async init ({app, robot, logger, adapter}) {
      function route (fullPath, options) {
        let parts = fullPath.split('.')
        let methodName = parts.pop()
        let Class = get(classes, parts)

        let object = new Class({
          app,
          robot,
          logger,
          adapter,
          services}, options)
        return object[methodName].bind(object)
      }

      function name (customName) {
        return (req, res, next) => {
          req.customName = customName
          req.logger = logger
          req.context = {}
          next()
        }
      }

      app.get('/descriptor', name('app.descriptor'), route('App.descriptor'))

      app.post('/api/installed', name('app.installed'), route('App.installed'))
      app.post('/api/uninstalled', name('app.uninstalled'), route('App.uninstalled'))

      app.post('/api/bot/message', name('bot.message'), route('sessions.StrideBearer.check'), route('Bot.message'))
      app.post('/api/roster/update', name('bot.roster.update'), route('sessions.StrideBearer.check'), route('Bot.rosterUpdate'))
    }
  }

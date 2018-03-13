const Route = require('./Route')
const template = require('../atlassian-connect')
const {stride} = require('../common/config').get('')

module.exports =
  class extends Route {
    descriptor (req, res) {
      const config = template(Object.assign({
        localBaseUrl: 'https://' + req.headers.host
      }, stride))
      res.json(config)
    }

    installed (req, res) {
      res.sendStatus(204)
    }

    uninstalled (req, res) {
      res.sendStatus(204)
    }
  }

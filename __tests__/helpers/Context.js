const resources = require('./resources')
const uuid = require('uuid')

class Context {
  constructor (options = {app: true, worker: false}) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000
    this.options = options
    this.contextId = uuid.v1()
    this.client = null
    this.app = null
  }

  async begin () {
    const startApp = (new resources.App()).start()
    const app = await startApp

    this.client = app.client

    this.app = app

    this.config = require('../../lib/common/config')
    return this
  }

  async end () {
    if (this.app) {
      await this.app.stop()
    }
  }
}

module.exports = Context

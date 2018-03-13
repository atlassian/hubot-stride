const Component = require('./Component')

const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')

const config = require('../common/config')

module.exports = class extends Component {
  async init ({logger}) {
    const app = express()

    app.use(compression())
    app.use(helmet({
      frameguard: false
    }))
    app.use(bodyParser.raw({ limit: '10mb' }))
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
    app.use(bodyParser.json({ limit: '10mb' }))

    this.app = app

    return app
  }

  start ({logger}) {
    return new Promise((resolve, reject) => {
      const port = config.get('web').port
      this.server = this.app.listen(port, error => {
        logger.info(`Web-Server listening at port:${port}`)
        error ? reject(error) : resolve(this.app)
      })
    })
  }

  async stop ({logger}) {
    if (this.server) {
      this.server.close()
    }

    logger.info('Web-Server stopped')
  }
}

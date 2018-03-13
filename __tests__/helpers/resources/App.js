const request = require('supertest')
const FakeRobot = require('../mocks/hubot/robot')

class App {
  async start () {
    process.env['HUBOT_STRIDE_CLIENT_ID'] = 'test-client-id'
    process.env['HUBOT_STRIDE_CLIENT_SECRET'] = 'test-client-secret'

    const StrideAdapter = require('../../../lib/web')

    this.robot = new FakeRobot()
    this.adapter = StrideAdapter.use(this.robot)

    await new Promise((resolve, reject) => {
      this.adapter.once('connected', () => {
        this.client = request(this.adapter.components.app)
        resolve(this.adapter)
      })

      this.adapter.once('error', (error) => {
        reject(error)
      })

      this.adapter.run()
    })

    return this
  }

  async stop () {
    return this.adapter.close()
  }
}

module.exports = App

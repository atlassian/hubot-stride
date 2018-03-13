const {Adapter} = require('hubot')
const Stride = require('./common/net/Stride')
const Promise = require('bluebird')
const config = require('./common/config')
const components = require('./components')
const { Document } = require('adf-builder')
const sc = new Stride()

class StrideAdapter extends Adapter {
  constructor (robot, options) {
    super(robot)
    this.robot = robot

    if (process.env.HUBOT_STRIDE_CLIENT_ID === undefined ||
        process.env.HUBOT_STRIDE_CLIENT_ID === null) {
      throw new Error('HUBOT_STRIDE_CLIENT_ID undefined')
    }

    if (process.env.HUBOT_STRIDE_CLIENT_SECRET === undefined ||
        process.env.HUBOT_STRIDE_CLIENT_SECRET === null) {
      throw new Error('HUBOT_STRIDE_CLIENT_SECRET undefined')
    }

    config.validate()

    this.webServerComponent = new components.WebServer()
    this.routesComponent = new components.Routes()
  }

  async run () {
    try {
      this.components = {
        logger: this.robot.logger,
        robot: this.robot
      }

      const initOrder = [
        { name: 'app', component: this.webServerComponent },
        { name: 'routes', component: this.routesComponent }
      ]
      await invokeReduce(initOrder, 'init', this.components)

      const startOrder = [
        { name: 'app', component: this.webServerComponent },
        { name: 'routes', component: this.routesComponent }
      ]
      await invokeReduce(startOrder, 'start', this.components)

      this.emit('connected')
    } catch (error) {
      this.emit('error', error)
    }
  }

  async close () {
    const stopOrder = [
      { name: 'app', component: this.webServerComponent },
      { name: 'routes', component: this.routesComponent }
    ]

    await invokeReduce(stopOrder, 'stop', this.components)
  }

  send (envelope, ...messages) {
    const doc = new Document()

    messages.forEach(msg => {
      doc.paragraph()
        .text(msg)
    })

    sc.sendMessage(envelope.room.cloudId, envelope.room.conversationId, doc)
  }

  reply (envelope, ...messages) {
    const userId = envelope.user.id
    const doc = new Document()

    messages.forEach(msg => {
      doc.paragraph()
        .mention(userId)
        .text(': ')
        .text(msg)
    })

    sc.sendMessage(envelope.room.cloudId, envelope.room.conversationId, doc)
  }
}

function invokeReduce (order, funcName, acc) {
  return Promise.reduce(order, async (acc, elem) => {
    const inited = await elem.component[funcName](acc)
    acc[elem.name] = inited

    return acc
  }, acc)
}

module.exports = StrideAdapter

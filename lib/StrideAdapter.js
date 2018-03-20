const {Adapter} = require('hubot')
const Promise = require('bluebird')
const config = require('./common/config')
const components = require('./components')
const { Document, Paragraph } = require('adf-builder')
const sc = require('./common/net/Stride')()
const { extractUrlsWithIndices } = require('twitter-text')
const _ = require('lodash')

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
      const paragraph = doc.paragraph()
      this._textToParsedParagraph(msg, paragraph)
    })

    sc.sendMessage(envelope.room.cloudId, envelope.room.conversationId, doc)
      .catch(error => {
        this.robot.emit('error', error)
      })
  }

  reply (envelope, ...messages) {
    const userId = envelope.user.id
    const doc = new Document()

    messages.forEach(msg => {
      const paragraph = doc.paragraph()
      paragraph
        .mention(userId)
        .text(': ')
      this._textToParsedParagraph(msg, paragraph)
    })

    sc.sendMessage(envelope.room.cloudId, envelope.room.conversationId, doc)
      .catch(error => {
        this.robot.emit('error', error)
      })
  }

  _textToParsedParagraph (text, paragraph) {
    const urlsWithIndices = extractUrlsWithIndices(text)

    const plainIndices = urlsWithIndices.reduce((acc, urlIndex) => {
      acc.push(urlIndex.indices[0])
      acc.push(urlIndex.indices[1])
      return acc
    }, [0])
    plainIndices.push(text.length)

    plainIndices.forEach((item, currIndex) => {
      const nextItem = plainIndices[currIndex + 1]
      if (nextItem) {
        if (currIndex % 2) {
          const nodeText = text.slice(item, nextItem)
          if (nodeText) {
            paragraph.link(nodeText, nodeText)
          }
        } else {
          const nodeText = text.slice(item, nextItem)
          if (nodeText) {
            paragraph.text(nodeText)
          }
        }
      }
    })

    return paragraph
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

const { EventEmitter } = require('events')

class FakeRobot extends EventEmitter {
  constructor () {
    super()
    this.logger = console
    this.receive = jest.fn()
    this.brain = {
      userForId: jest.fn(senderId => ({ senderId }))
    }
  }
}

module.exports = FakeRobot

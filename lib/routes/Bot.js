const Route = require('./Route')
const {TextMessage, EnterMessage, LeaveMessage} = require('hubot')

module.exports =
  class extends Route {
    message (req, res) {
      res.json({})
      const senderId = req.body.sender.id

      const user = this.robot.brain.userForId(senderId, {
        name: senderId,
        room: {
          cloudId: req.context.cloudId,
          conversationId: req.context.conversationId
        }
      })
      const textMessage = new TextMessage(user, req.body.message.text, req.body.message.id)
      this.robot.receive(textMessage)
    }

    rosterUpdate (req, res) {
      res.json({})

      const userId = req.body.user.id
      const user = this.robot.brain.userForId(userId, {
        name: userId,
        room: {
          cloudId: req.context.cloudId,
          conversationId: req.context.conversationId
        }
      })

      if (req.body.action === 'add') {
        this.robot.receive(new EnterMessage(user, null, null))
      }

      if (req.body.action === 'remove') {
        this.robot.receive(new LeaveMessage(user, null, null))
      }
    }
  }

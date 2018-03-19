const {Context} = require('../helpers')
const context = new Context()
const jwt = require('jsonwebtoken')
const {EnterMessage} = require('hubot')

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter receives roster updates when user enters conversation', async () => {
  const cloudId = 'cloudId-1'
  const conversationId = 'conversationId-1'
  const userId = '4rh3498fh8'

  const token = jwt.sign({
    iss: context.config.get('stride.clientId'),
    context: {
      resourceId: conversationId,
      cloudId
    }
  }, context.config.get('stride.clientSecret'))

  const res = await context.client
    .post(`/api/roster/update`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      user: {
        id: userId
      },
      action: 'add'
    })

  const textMessage = context.app.robot.receive.mock.calls[0][0]

  expect(textMessage).toBeInstanceOf(EnterMessage)
  expect(textMessage).toMatchObject({
    done: false,
    user: {
      id: userId,
      name: userId
    },
    room: {
      cloudId,
      conversationId
    }
  })

  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject({})
})

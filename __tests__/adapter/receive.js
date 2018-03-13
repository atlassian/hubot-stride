const {Context} = require('../helpers')
const context = new Context()
const jwt = require('jsonwebtoken')

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter can receive messages', async () => {
  const token = jwt.sign(
    {iss: context.config.get('stride.clientId')},
    context.config.get('stride.clientSecret')
  )
  const data = {
    sender: {
      id: '4rh3498fh8'
    },
    message: {
      id: '33h84g3h4g34',
      text: 'some text'
    }
  }
  const res = await context.client
    .post(`/api/bot/message`)
    .set('Authorization', `Bearer ${token}`)
    .send(data)
  const textMessage = context.app.robot.receive.mock.calls[0][0]

  expect(textMessage).toMatchObject({
    id: data.message.id,
    text: data.message.text,
    user: {
      senderId: data.sender.id
    }
  })
  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject({})
})

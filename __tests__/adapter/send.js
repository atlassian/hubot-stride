const {Context, mocks, utils} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter.send sends message to Stride', async () => {
  const getTokenRequest = utils.waitForRequest(mocks.stride.listeners.getToken)
  const sendMessageRequest = utils.waitForRequest(mocks.stride.listeners.sendMessage)

  context.app.adapter.send({
    room: {
      cloudId: mocks.stride.listeners.defaultCloudId,
      conversationId: mocks.stride.listeners.defaultConversationId
    }
  }, 'test message')

  await getTokenRequest
  const res = await sendMessageRequest
  expect(res.body).toEqual({
    'body': {
      'content': [{
        'content': [{
          'text': 'test message',
          'type': 'text'
        }],
        'type': 'paragraph'
      }],
      'type': 'doc',
      'version': 1
    }
  })
})

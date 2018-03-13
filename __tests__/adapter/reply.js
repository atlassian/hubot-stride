const {Context, mocks, utils} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter.reply sends message to Stride with user mention prepended', async () => {
  const getTokenRequest = utils.waitForRequest(mocks.stride.listeners.getToken)
  const sendMessageRequest = utils.waitForRequest(mocks.stride.listeners.sendMessage)

  context.app.adapter.reply({
    room: {
      cloudId: mocks.stride.listeners.defaultCloudId,
      conversationId: mocks.stride.listeners.defaultConversationId
    },
    user: {
      id: 'dummy-user-id'
    }
  }, 'test message')

  await getTokenRequest
  const res = await sendMessageRequest
  expect(res.body).toEqual({
    'body': {
      'content': [{
        'content': [{
          'attrs': {
            'id': 'dummy-user-id'
          },
          'type': 'mention'
        }, {
          'text': ': ',
          'type': 'text'
        }, {
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

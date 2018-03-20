const {Context, mocks, utils} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter.send sends message with parsed links to Stride', async () => {
  const getTokenRequest = utils.waitForRequest(mocks.stride.listeners.getToken)
  const sendMessageRequest = utils.waitForRequest(mocks.stride.listeners.sendMessage)

  context.app.adapter.send({
    room: {
      cloudId: mocks.stride.listeners.defaultCloudId,
      conversationId: mocks.stride.listeners.defaultConversationId
    }
  }, ' test message https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif test https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif test ')

  await getTokenRequest
  const res = await sendMessageRequest
  expect(res.body).toEqual({
    'body': {
      'content': [{
        'content': [{
          'text': ' test message ',
          'type': 'text'
        }, {
          'marks': [{
            'attrs': {
              'href': 'https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif'
            },
            'type': 'link'
          }],
          'text': 'https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif',
          'type': 'text'
        }, {
          'text': ' test ',
          'type': 'text'
        }, {
          'marks': [{
            'attrs': {
              'href': 'https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif'
            },
            'type': 'link'
          }],
          'text': 'https://media.giphy.com/media/dTJd5ygpxkzWo/giphy.gif',
          'type': 'text'
        }, {
          'text': ' test ',
          'type': 'text'
        }],
        'type': 'paragraph'
      }],
      'type': 'doc',
      'version': 1
    }
  })
})

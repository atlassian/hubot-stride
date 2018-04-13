const {Context, mocks, utils} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter.send sends message to Stride', async () => {
  const getTokenRequest = utils.waitForRequest(mocks.stride.listeners.getToken)
  const sendMessageMarkdownRequest = utils.waitForRequest(mocks.stride.listeners.sendMessageMarkdown)

  context.app.adapter.send({
    room: {
      cloudId: mocks.stride.listeners.defaultCloudId,
      conversationId: mocks.stride.listeners.defaultConversationId
    }
  }, 'test message')

  await getTokenRequest
  const res = await sendMessageMarkdownRequest
  expect(res.body).toEqual('test message')
})

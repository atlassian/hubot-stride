const {Context, mocks, utils} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter.send emits error on failed Stride API calls', async (done) => {
  const getTokenRequest = utils.waitForRequest(mocks.stride.listeners.getToken)
  const sendMessageMarkdown400Request =
    utils.waitForRequest(mocks.stride.listeners.sendMessageMarkdown400)

  context.app.adapter.send({
    room: {
      cloudId: mocks.stride.listeners.defaultCloudId,
      conversationId: mocks.stride.listeners.defaultConversationId
    }
  }, 'test message')

  context.app.robot.once('error', res => {
    expect(res).toMatchObject({
      code: 400,
      source: 'stride',
      state: {
        req: {
          method: 'POST',
          headers: {
            'Content-Type': 'text/markdown',
            Authorization: 'Bearer kinda jwt'
          },
          body: 'test message',
          url: 'https://api.atlassian.com/site/a436116f-02ce-4520-8fbb-7301462a1674/conversation/b1d1f2c9-d9c7-4de6-8cfd-e31029fb4ad0/message'
        },
        methodName: 'sendMessageMarkdown',
        res: {
          headers: {},
          status: 400,
          body: ''
        }
      }
    })
    done()
  })

  await getTokenRequest
  await sendMessageMarkdown400Request
})

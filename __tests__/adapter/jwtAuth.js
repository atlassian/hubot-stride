const {Context} = require('../helpers')
const context = new Context()
const jwt = require('jsonwebtoken')

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter returns 401 for requests signed with wrong jwt', async () => {
  const token = jwt.sign(
    {iss: context.config.get('stride.clientId')},
    'this-is-secret-which-we-donotwant-to-pass'
  )

  const res = await context.client
    .post(`/api/bot/message`)
    .set('Authorization', `Bearer ${token}`)
    .send({})

  expect(res.status).toEqual(401)
  expect(res.body).toEqual({
    error: {
      code: 'CHAT_AUTHENTICATION_FAILED',
      message: 'invalid signature'
    }
  })
})

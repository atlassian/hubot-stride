const {Context} = require('../helpers')
const context = new Context()
const jwt = require('jsonwebtoken')

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter handles uninstalled events', async () => {
  const token = jwt.sign(
    {iss: context.config.get('stride.clientId')},
    context.config.get('stride.clientSecret')
  )

  const res = await context.client
    .post(`/api/uninstalled`)
    .set('Authorization', `Bearer ${token}`)
    .send({})

  expect(res.status).toEqual(204)
})

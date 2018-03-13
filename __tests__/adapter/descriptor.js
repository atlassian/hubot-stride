const {Context} = require('../helpers')
const context = new Context()

beforeAll(() => context.begin())
afterAll(() => context.end())

test('Adapter serves descriptor', async () => {
  const res = await context.client.get('/descriptor')

  expect(res.status).toEqual(200)
  expect(res.body).toMatchObject({
    'lifecycle': {
      'installed': '/api/installed',
      'uninstalled': '/api/uninstalled'
    },
    'modules': {
      'chat:bot:messages': [{
        'key': 'bot-regex',
        'pattern': '.*',
        'url': '/api/bot/message'
      }],
      'chat:webhook': [{
        'event': 'roster:updates',
        'key': 'roster-updates',
        'url': '/api/roster/update'
      }]
    }
  })
})

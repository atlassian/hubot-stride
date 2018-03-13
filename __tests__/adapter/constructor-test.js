const StrideAdapter = require('../../lib/web')

process.env['HUBOT_STRIDE_CLIENT_ID'] = 'test-client-id'
process.env['HUBOT_STRIDE_CLIENT_SECRET'] = 'test-client-secret'

describe('Constructor environment variables checks', () => {
  function macro (propName) {
    return async function () {
      const prop = process.env[propName]
      delete process.env[propName]

      expect(() => {
        StrideAdapter.use({})
      }).toThrowError(`${propName} undefined`)

      process.env[propName] = prop
    }
  }
  test('should throw on construction if HUBOT_STRIDE_CLIENT_ID missing', macro('HUBOT_STRIDE_CLIENT_ID'))
  test('should throw on construction if HUBOT_STRIDE_CLIENT_SECRET missing', macro('HUBOT_STRIDE_CLIENT_SECRET'))
})

const convict = require('convict')

const config = convict({
  stride: {
    clientId: {
      default: 'test-client-id',
      doc: 'Stride Client Id',
      format: String,
      env: 'HUBOT_STRIDE_CLIENT_ID'
    },
    clientSecret: {
      default: 'test-client-secret',
      doc: 'Stride Client Secret',
      format: String,
      env: 'HUBOT_STRIDE_CLIENT_SECRET'
    }
  },
  web: {
    port: {
      default: 8000,
      doc: 'Port on which bot will operate',
      format: 'port',
      env: 'HUBOT_STRIDE_WEB_PORT'
    }
  }
})

module.exports = config

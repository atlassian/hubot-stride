
const nock = require('nock')

const defaultConversationId = 'b1d1f2c9-d9c7-4de6-8cfd-e31029fb4ad0'
const defaultCloudId = 'a436116f-02ce-4520-8fbb-7301462a1674'
const apiUrl = 'https://api.atlassian.com'

function sendMessage (onReply, {
  cloudId = defaultCloudId,
  conversationId = defaultConversationId
} = {}) {
  return nock(apiUrl)
    .post(`/site/${cloudId}/conversation/${conversationId}/message`)
    .reply(201, onReply())
}

function sendMessageMarkdown (onReply, {
  cloudId = defaultCloudId,
  conversationId = defaultConversationId
} = {}) {
  return nock(apiUrl)
    .post(`/site/${cloudId}/conversation/${conversationId}/message`)
    .reply(201, onReply())
}

function sendMessageMarkdown400 (onReply, {
  cloudId = defaultCloudId,
  conversationId = defaultConversationId
} = {}) {
  return nock(apiUrl)
    .post(`/site/${cloudId}/conversation/${conversationId}/message`)
    .reply(400, onReply())
}

function sendMessage400 (onReply, {
  cloudId = defaultCloudId,
  conversationId = defaultConversationId
} = {}) {
  return nock(apiUrl)
    .post(`/site/${cloudId}/conversation/${conversationId}/message`)
    .reply(400, onReply())
}

function getToken (onReply) {
  return nock('https://auth.atlassian.com')
    .post('/oauth/token')
    .reply(200, onReply({
      'access_token': 'kinda jwt',
      'expires_in': 86400,
      'scope': 'write:ananab read:ananab',
      'token_type': 'Bearer'
    }))
}

function uploadFile (onReply, {
  cloudId = defaultCloudId,
  conversationId = defaultConversationId
} = {}) {
  return nock(apiUrl)
    .post(`/site/${cloudId}/conversation/${conversationId}/media`)
    .query(true)
    .reply(201, onReply({
      data: {
        id: 'dummy_file_id'
      }
    }))
}

module.exports = {
  getToken,
  sendMessage,
  sendMessage400,
  sendMessageMarkdown,
  sendMessageMarkdown400,
  uploadFile,
  defaultCloudId,
  defaultConversationId
}

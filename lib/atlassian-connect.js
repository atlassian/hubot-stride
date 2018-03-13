module.exports = ({localBaseUrl}) => {
  return {
    baseUrl: localBaseUrl,
    lifecycle: {
      installed: '/api/installed',
      uninstalled: '/api/uninstalled'
    },
    modules: {
      'chat:bot:messages': [
        {
          key: 'bot-regex',
          pattern: '.*',
          url: '/api/bot/message'
        }
      ],
      'chat:webhook': [
        {
          key: 'roster-updates',
          event: 'roster:updates',
          url: '/api/roster/update'
        }
      ]
    }
  }
}

function waitForRequest (registerRequestListener, timeout = 2500) {
  const error = new Error(`Waiting > ${timeout} ms`)

  return new Promise((resolve, reject) => {
    function onReply (response) {
      return (uri, body) => {
        resolve({ uri, body })
        return response
      }
    }

    registerRequestListener(onReply)

    setTimeout(
      () => reject(error),
      timeout
    )
  })
}

module.exports = waitForRequest

module.exports = class ServiceError extends Error {
  constructor (message, {code, fields} = {}) {
    super(message)

    this.message = message
    this.code = code
    this.fields = fields
  }

  toJSON () {
    return {
      message: this.message,
      code: this.code,
      fields: this.fields
    }
  }
}

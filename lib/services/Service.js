const LIVR = require('livr')
const ServiceError = require('./Error')

module.exports = class Service {
  constructor ({logger, context, robot}) {
    this.logger = logger
    this.context = context
    this.robot = robot
  }

  validator (params, rules) {
    let validator = new LIVR.Validator(rules)
    let result = validator.validate(params)

    if (result) {
      return result
    }

    let fields = validator.getErrors()
    this.logger.info('Validation error:', fields)

    throw new ServiceError('Validation error', {
      fields: fields,
      code: 'FORMAT_ERROR'
    })
  }

  async run (params) {
    const validatedParams = await this.validate(params)
    return this.execute(validatedParams)
  }

  validate () {
    return {}
  }
}

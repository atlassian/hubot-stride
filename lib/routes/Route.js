const ServiceError = require('../services/Error')
const {get} = require('lodash')

const serviceErrorCodeMap = {
  'FORMAT_ERROR': 400,
  'WRONG_ID': 404
}

module.exports = class Route {
  constructor ({services, robot, logger}, options) {
    this.services = services
    this.robot = robot
    this.logger = logger
    this.options = options || {}
  }

  initService (name, params) {
    let Service = get(this.services, name)

    if (!Service) {
      throw new Error(`Can't find service by name: ${name}`)
    }

    let run = (req, res) => {
      const serviceCall = new Service({
        logger: req.logger,
        context: req.context,
        robot: this.robot
      })
        .run(params)

      return res
        ? this.renderPromise(serviceCall, req, res)
        : serviceCall
    }

    return {run}
  }

  async renderPromise (promise, req, res) {
    try {
      const data = await Promise.resolve(promise)
      let status = {
        PUT: 201,
        POST: 201,
        PATCH: 200,
        DELETE: 200,
        GET: 200
      }[ req.method ]

      res.status(status || 200)

      if (typeof data === 'object') {
        return res.json(data)
      } else {
        res.send(data)
      }
    } catch (error) {
      return this.handleError(error, req, res)
    }
  }

  handleError (error, req, res) {
    if (error instanceof ServiceError) {
      const status = serviceErrorCodeMap[error.code] || 500
      return res.status(status).json({error: error.toJSON()})
    }

    const logObj = {
      msg: 'Unexpected error',
      err: error
    }

    req.logger.error(logObj)

    res.status(500).json({error: {
      message: 'Something went wrong! Please, try again later.',
      code: 'UNEXPECTED_ERROR',
      logger_trace_id: req.logger_trace_id
    }})
  }
}

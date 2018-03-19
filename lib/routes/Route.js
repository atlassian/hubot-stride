module.exports = class Route {
  constructor ({services, robot, logger}, options) {
    this.services = services
    this.robot = robot
    this.logger = logger
    this.options = options || {}
  }
}

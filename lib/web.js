const StrideAdapter = require('./StrideAdapter')

function use (robot) {
  return new StrideAdapter(robot)
}

exports.use = use

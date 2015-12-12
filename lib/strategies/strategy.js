/*
Base Strategy
*/
var Strategy = function () {
  if (this.handle === undefined) {
    throw new Error('Must implement a handle function');
  }
}

Strategy.prototype.use = function (manager, application, cb) {
  this.handle(manager, application, cb);
}

module.exports = Strategy;
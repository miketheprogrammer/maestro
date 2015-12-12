var util = require('util')

var Strategy = require('./strategy');

/*
Deploy an instance of this application on every server
*/
var EveryWhere = function () {
  Strategy.call(this)
}

util.inherits(EveryWhere, Strategy);

EveryWhere.prototype.handle = function (manager, application, cb) {
  manager.nodes.forEach(function (node) {
    console.log('node');
  })
}

module.exports = EveryWhere;
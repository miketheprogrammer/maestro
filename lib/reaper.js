// bootstrap the global manager
var Manager = global.Manager;
var async = require('async');

/*
This class will reap out of date applications.
*/
var Reaper = function (opts) {
  this.running = false;
  this.opts = opts || {}
  this.opts.tick = 1000;
}

/*
Start the run loop
*/
Reaper.prototype.run = function () {
  setInterval(this._run.bind(this), this.opts.tick)
}

/*
Private helper function for the run loop
*/
Reaper.prototype._run = function () {
  if (this.running) return;
  this.running = true;
  async.mapLimit(Manager.applicationsArray(), 1, this.reap.bind(this), function (err, results) {
    this.running = false;
  }.bind(this))
}

/*
Execute a reap sweep by application
*/
Reaper.prototype.reap = function (application, cb) {
  if (Manager.applicationCount(application) > application.scale) {
    console.log('We need to reap:', application.name);
  }
  var reapCount = Manager.applicationCount(application) - application.scale;
  if (reapCount <= 0) {
    return cb(null, 'done');
  }
  if (isNaN(reapCount)) {
    console.error('reapCount is NaN');
    return cb(null, 'error');
  }
  console.log('removing reapCount', reapCount);
  async.mapLimit((new Array(reapCount)).map(function(i) { return true } ), 1, function (i, cb) {
    var nodes = Manager.nodesWithApplication(application);
    // console.log(require('util').inspect(nodes, {depth:10}))
    var node = nodes[Math.floor(Math.random() * nodes.length)];
    var containers = node.getContainersByApplication(application);
    var container = node._docker.getContainer(containers.pop().Id);
    node.containers = containers;
    console.log('Removing', container.Id);
    container.stop(function (err, res) {
      container.remove(function (err, res) {
        console.log('RemoveResult', err, res);
        cb(err, res);
      });
    })

  }, function (err, results) {
    console.log('ReapResult', application.name, results);
    cb(err, results);
  });


}


module.exports = Reaper;
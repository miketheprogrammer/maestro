var consul = require('consul')(process.env.CONSUL_HOST, process.env.CONSUL_PORT);
var async = require('async')
var Node = require('./node');
var Application = require('./application')

var Strategies = require('./strategies')

/*
  Class for managing all the subclasses. Expose methods for acting on collections
*/
var Manager = function () {
  this.applications = {}
  this.nodes = {};
  // load the existing applications from Consul
  this.loadApplications(console.log);
};

/*
  Update nodes based on a scan of consul
*/
Manager.prototype.refresh = function (cb) {
  this.refreshNodes()
}

/*
  Scan Consul for active nodes
*/
Manager.prototype.refreshNodes = function (cb) {
  cb = cb || function() {}
  consul.catalog.node.list(function(err, result) {
    async.map(result, function (node, cb) {
      Node.new(node.Address, cb);
    }, function (err, res) {
      if (err) console.error('ERROR', err, err.stack)
      this.nodes = res.filter(function (r) { return r !== undefined } )
      cb(null, res);
    }.bind(this))
  }.bind(this))
}

/*
  Load existing applications from consul
*/
Manager.prototype.loadApplications = function (cb) {
  consul.kv.keys(Application.baseKey, function (err, keys) {
    async.map(keys, this.loadApplication.bind(this), function (err, applications) {
      if (err) console.err(err);
      return cb(err, applications)
    }.bind(this));
  }.bind(this))
}

/*
  Load single application from consul
*/
Manager.prototype.loadApplication = function (key, cb) {
  var application = this.applications[key] || new Application;
  application.load(key, function (err, application) {
    if (err) return cb(err);
    this.applications[application.id] = application;
    cb(null, application);
  }.bind(this));
}

/*
  Upsert application to consul
*/
Manager.prototype.upsertApplication = function (opts, cb) {
  this.loadApplication((new Application(opts)).key(), function (err, application) {
    if (err || application === undefined) application = new Application(opts);
    for (var key in opts) {
      console.log(key, application[key], opts[key]);
      application[key] = opts[key]
      console.log(key, application[key], opts[key]);
    }
    application.save(function (err, response) {
      console.log('Application Save', err, response)
      if (err) return cb(err);
      this.applications[application.id] = application;
      return cb(null, response);
    }.bind(this));
  }.bind(this))
}

/*
  Deploy application via its chosen strategy
*/
Manager.prototype.strategize = function (application, cb) {
  console.log(Strategies)
  if (application.strategy) {
    if (Strategies[application.strategy]) {
      console.log('running strategy', application.strategy, 'for', application.name);
      Strategies[application.strategy].use(this, manager, application, cb);
      return cb()
    } else {
      console.error('strategy does not exist');
      return cb(new Error('Strategy does not exist'));
    }
  }

  console.log('running default strategy for', application.name);
  Strategies['default'].use(this, application, cb);
}

/*
  Execute all deployments
*/
Manager.prototype.executeDeployments = function (cb) {
  cb = cb || function() {}
  if (this.running === true) return;
  this.running = true
  async.mapLimit(Object.keys(this.applications).map(function (key) { return this.applications[key] }.bind(this)), 1, this.strategize.bind(this), function (err, results) {
    this.running = false;
    cb(err, results);
  }.bind(this))
}

/*
  Convert Applications Map to an array
*/
Manager.prototype.applicationsArray = function () {
  return Object.keys(this.applications).map(function (key) { return this.applications[key] }.bind(this));
}

/*
  Get nodes with a given application
*/
Manager.prototype.nodesWithApplication = function (application) {
  return this.nodes.filter(function (node) {
    if (node.hasApplication(application)) {
      return true;
    }
  })
}

/*
  Get cross-node application cound by application
*/
Manager.prototype.applicationCount = function (application) {
  // console.log('Calculating application count', this.nodes, 'end nodes');
  if (this.nodes.length === 0) return 0;
  if (this.nodes.length === 1) return this.nodes[0].applicationCount(application);
  return this.nodes.reduce(function (p, c, i) {
    // console.log('reducing', p, c, i);
    if ('object' === typeof p) {
      p = p.applicationCount(application);
    }
    console.log('returning', p + c.applicationCount(application));
    return p + c.applicationCount(application);
  })
}

/*
  Select a random node
*/
Manager.prototype._randomNode = function () {
  return this.nodes[Math.floor(Math.random() * this.nodes.length)]
}

/*
  Select a node with the least containers
*/
Manager.prototype.leastContainers = function () {
  return this.nodes.sort(function (nodeA, nodeB) {
    if (nodeA.containers.length < nodeB.containers.length) {
      return -1;
    }
    if (nodeA.containers.length > nodeB.containers.length) {
      return 1;
    }
    return 0

  })[0]
}

/*
Manager run loop
*/
Manager.prototype.run = function () {
  setInterval(function () {
    this.refresh()
  }.bind(this), this.tick || 5000)
  setInterval(function () {
    console.log('MANAGER ABOUT TO EXECUTE DEPLOY', this.applications);
    this.executeDeployments()
  }.bind(this), 1000)
  this.refresh();
}

module.exports = Manager;

// m = new Manager
// m.run();
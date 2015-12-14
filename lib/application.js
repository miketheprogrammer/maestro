var consul = require('consul')(process.env.CONSUL_HOST, process.env.CONSUL_PORT);
var slug = require('slugify');


/*
Application is our main structure for representing an image as a collection of commands, options, strategies, and environment variables.
We can construct a full docker run command from this object.
*/
var Application = function(opts) {
  opts = opts || {};
  // The name of the application
  this.name = opts.name
  if (this.name) this.id = slug(this.name);
  // The docker image to use
  this.image = opts.image;
  // The command to execute
  this.command = opts.command;
  // The Maestro Options that may be neccessary
  this.options = opts.options;
  // The scale at which to deploy the app
  this.scale = opts.scale || 1;
  // The strategy to use when deploying the app
  this.strategy = opts.strategy;
  // Raw docker remote api options to pass to docker.
  this.docker_options = opts.docker_options;

  // Container for the raw data from consul
  // To be used in serialization.
  this.__raw = {
      name: null,
      image: null,
      command: null,
      options: null,
      scale: null,
      strategy: null,
      docker_options: null
  }
}

// not on prototype
// Beware with inheritance
Application.baseKey = 'applications/'

// Return the consul key for this app
Application.prototype.key = function() {
  return Application.baseKey + this.id;
}

/*
Serialize and save to Consul KV
*/
Application.prototype.save = function(cb) {
  cb = cb || function() {}
  console.log('APPLICATION SAVING', this.key(), this.serialize());
  consul.kv.set(this.key(), this.serialize(), cb);
}

/*
Serialize to JSON with pretty formatting
*/
Application.prototype.serialize = function() {
  var serialized = {}
  for (var key in this.__raw) {
      serialized[key] = this[key]
  }

  return JSON.stringify(serialized, null, 2);
}

/*
Load the application from Consul KV
*/
Application.prototype.load = function(key, cb) {
  console.log(key)
      // If callback is undefined, assume that the key is the callback
      // because the key is optional
  if (cb === undefined) {
      cb = key;
      key = undefined;
  }
  // If there is no callback, mock it out
  cb = cb || function() {};
  // Override or the application key
  key = key || this.key();
  consul.kv.get(key, function(err, result) {
      if (err) return cb(err);
      try {
          result = JSON.parse(result.Value)
      } catch (err) {
          return cb(err)
      }

      if ('object' === typeof this.__raw) this.__raw = result;
      for (var key in result) {
          this[key] = result[key]
      }
      if (result['dockerOptions']) {
        this['docker_options'] = result['dockerOptions'];

      }
      if (this.name) this.id = slug(this.name)
      cb(null, this)
  }.bind(this))
}

Application.prototype.pull = function (cb) {
  
}

// Application.prototype.deploy = function (docker, cb) {
//   var opts = JSON.parse(JSON.stringify(this.docker_options));
//   opts.Image = this.image;
//   opts.Labels = opts.Labels || {}
//   opts.Labels['com.application.name'] = this.name;
//   docker.createContainer(opts, function (err, container) {
//     if (err) return res.api(err);
//     container.start(opts.HostConfig, cb);
//   });  
// }

/*
Uncomment to test
*/
//var a = new Application({name:'hello world', image:'minerapp/hello', options:{ port: 2000 } })
//a.save(console.log);
//var a = new Application({name:'hello world', image:'minerapp/hello'})
//a.load(console.log);

module.exports = Application;

var Docker = require('dockerode');
var fs = require('fs');

/*
Create a node from IP and callback.
This object will test for the docker container, and error out if unsucessful
*/
exports.new = function (ip, cb) {
  var node = {}
  console.log('new node')
  // ip hack for docker engine
  if (process.env.ENGINE_LOCAL) {
    node._docker = new Docker()
  } else {
    process.env.DOCKER_ENGINE_IP = "localhost"
    node.address = (process.env.DOCKER_ENGINE_IP || ip);
    node._docker = new Docker({
      // we need to hack this for docker-engine
      host: 'http://'+ node.address,
      port: 2376,
      // ca: fs.readFileSync('~/.docker/ca.pem'),
      // cert: fs.readFileSync('~/.docker/cert.pem'),
      // key: fs.readFileSync('~/.docker/key.pem')
    });
  }
  cb = cb || function () {}
  node._docker.listContainers(function (err, containers) {
    if (err) {
      console.error(err);
      return cb(null, undefined)
    }
    node.containers = containers;
    return cb(null, node);
  })

  /*
  Test if a node has an application
  returns true or false;
  */
  node.hasApplication = function (application) {
    console.log('Node Containers');
    var containers = this.getContainersByApplication(application);
    if (containers.length > 0) return true;
    else return false;
  }

  /*
  Get containers by application
  */
  node.getContainersByApplication = function (application) {
    // console.log('BUG1', this);
    return this.containers.filter(function (container) {
      return container.Labels['com.application.name'] === application.name
    });
  }

  /*
  Get count of containers by application 
  */
  node.applicationCount = function (application) {
    if (!this.hasApplication(application)) return 0;
    else return this.getContainersByApplication(application).length
  }
};

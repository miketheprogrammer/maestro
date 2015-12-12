var Docker = require('dockerode');

/*
Create a node from IP and callback.
This object will test for the docker container, and error out if unsucessful
*/
exports.new = function (ip, cb) {
  var node = {}
  node.address = ip;
  node._docker = new Docker({host: 'http://'+ip, port: 4243});
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

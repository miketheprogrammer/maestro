var util = require('util')

var Strategy = require('./strategy');

/*
Deploy an instance of this application on every server
*/
var Default = function () {
  Strategy.call(this)
}

util.inherits(Default, Strategy);

Default.prototype.handle = function (manager, application, cb) {
  console.log('handling default')
  var applicationScale = manager.applicationCount(application);
  console.log('hasScale', applicationScale);
  console.log('needsScale', application.scale)
  if ( applicationScale >= application.scale) {
    console.log('application at scale already');
    return cb(null, 'application at scale already');
  }
  var node = manager.leastContainers();
  var opts = JSON.parse(JSON.stringify(application.dockerOptions));
  opts.Image = application.image;
  opts.Labels = opts.Labels || {}
  opts.Labels['com.application.name'] = application.name;
  console.log('creating container');
  node._docker.createContainer(opts, function (err, container) {
    if (err) {
      console.error(err, err.stack);
      if (err.message.indexOf('404') !== -1) {
        return node._docker.pull(application.image, function (err, stream) {
          stream.pipe(process.stdout);
          stream.on('end', function () {
            console.log('image pulled');
            return this.handle(manager, application, cb);
          }.bind(this))
        }.bind(this))
      } else {
        return cb(err)
      }
    }
    console.log('Deploy result', err, container);
    container.start(opts.HostConfig, function (err, response) {
      node._docker.listContainers(function (err, containers) {
        if (err) return cb(err);
        console.log(containers);
        var c = containers.filter(function (_container) {
          console.log('checking for just deployed container', _container.Id, container.id)
          return _container.Id === container.id;
        })[0]
        console.log(c)
        node.containers.push(c);
        return cb(null, c);
      })
    });

  }.bind(this));
}

module.exports = Default;
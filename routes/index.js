var express         = require('express');
var bodyParser      = require('body-parser');
var Application     = require('../lib/application');
var app             = express();

var manager = global.Manager;

/*
Easy response middleware for standard response objects
*/
app.use(function (req, res, next) {
  res.api = function (err, value) {
    if (err) {
      return res.status(value || 500).send(JSON.stringify({success: false, error: err.message}));
    }
    if (value) {
      return res.status(200).send(JSON.stringify(value, null, 2));
    }
    return res.status(200).send(JSON.stringify({success: true, error: null}));
  }
  next();
})

/*
Parse JSON baby 
*/
app.use(bodyParser.json({strict: false}));

/*
RESTful getApplicationById GET /application:id 
*/
app.get('/application/:id', function (req, res) {
  var application = new Application({name: req.params.id})
  console.log(application, application.id, manager.applications);
  application = manager.applications[application.id];
  if (application === undefined) {
    return res.api(new Error('Application does not exist'), 404)
  }
  return res.api(null, application);
})

/*
 Post a new application
*/
app.post('/application', function (req, res) {
  if ('string' !== typeof req.body.name) return res.api(new Error('name must be a string'))
  if ('string' !== typeof req.body.image) return res.api(new Error('image must be a string'))
  if ('string' !== typeof req.body.command) return res.api(new Error('command must be a string'))

  manager.upsertApplication(req.body, function (err, response) {
    res.api(err, response);
  })
});

// /*
// */
// app.get('/deploy/:id', function (req, res) {
//   var application = new Application({name: req.params.id})
//   application.load(function (err, application) {
//     application.deploy(manager._randomNode()._docker, res.api.bind(res));
//   })
// })

app.get('/nodes', function (req, res) {
  res.api(null, manager.nodes);
})

module.exports = app;

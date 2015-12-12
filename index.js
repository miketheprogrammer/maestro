// Initialize Manager
global.Manager         = new (require('./lib/manager'));
Manager.run()
// Initialize Reaper
var Reaper = new (require('./lib/reaper'));
Reaper.run();
// Initialize Routes
var app = require('./routes');

// listen
app.listen(process.env.PORT || 8080);

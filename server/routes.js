var fs = require('fs');
var yelpSearch = require('./yelpSearch.js');
var db = require('./database/database.js');
var bodyParser = require('body-parser');
var utils = require('./config/utils.js');
var passport = require('passport');


module.exports = function (app, express) {

  app.use(express.static(__dirname + '/../client'));
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends', 'email']}));
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '#/signup'
    }));

  // app.use(utils.isLoggedIn);
  //facebook route

  app.route('/')
    .get(function(req, res) {
      res.render('index');
    });

  app.get('/api/search', yelpSearch);

  app.route('/api/routes/:uid/:location?')
    .delete((req, res, next) => {
      if (req.params.location === undefined) {
        // Delete all routes for the current user.
        db.removeRoutes(req.params.uid);
      } else {
        // Delete routes that only match the given location.
        db.removeRoutes(req.params.uid, undefined, req.params.location);
      }
      res.status(202).send('Started route removal.');
    })
    .put((req, res, next) => {
      if (req.params.location !== undefined) {
        // Add a new location to our list of routes.
        db.addRoute(req.params.uid, req.params.location);
        res.status(202).send('Adding new route');
      } else {
        // Invalid endpoint.
        res.status(400).send('Must specify location to add to routes');
      }
    })
    .get((req, res, next) => {
      if (req.params.location !== undefined) {
        // Invalid endpoint.
        res.status(400).send('No location parameter needed');
      } else {
        // Get all of the locations.
        db.getRoutes(req.params.uid).then(rows => {
          res.status(200).send(JSON.stringify(rows));
        });
      }
    });

  // route for logging out
  app.get('/auth/logout', function(req, res) {
      req.logout();
      res.redirect('/#/login');
  });
  app.use(function(req, res){
    res.status(404);

    if (req.accepts('html')) {
      // respond with html page
      res.send('404 - Not found');
      return;
    } else if (req.accepts('json')) {
      // respond with json
      res.send({ error: '404 - Not found' });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('404 - Not found');
  });
};


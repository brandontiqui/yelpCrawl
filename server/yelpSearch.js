var yelp = require("node-yelp");
var db = require('./database/database.js');
var fs = require('fs');
var config = require('./config/env/config.js');

var client = yelp.createClient({
  oauth: {
    "consumer_key": config.oauth.consumer_key,
    "consumer_secret": config.oauth.consumer_secret,
    "token": config.oauth.token, 
    "token_secret": config.oauth.token_secret 
  },
  
  // Optional settings: 
  httpClient: {
    maxSockets: 25  // ~> Default is 10 
  }
});
 
 
// exports promise
module.exports = (req, res) => {
  // use memoization via prev. cached results
  // ex.
  // if (db.hasEntry(req.headers.bar)){
  //   res.send(db.retrieveEntry(req.headers.bar));
  //   return;
  // }
  // console.log(req.query.name, req.query.location);
  console.log(req.query.location, '', 'req.query.loc');
	client.search({
	  terms: 'chilis',
	  location: req.query.location + 'California, USA' ,
     category_filter: "mexican"
	})
  .catch((err) => {
    res.send(err);
  })
  .then((obj) => {
    // does not check validity of result
    // relies on accuracy of google.maps.places results
    // console.log(obj.businesses[0]);
    if (obj){
      db.cacheYelpInfo(obj.businesses[0]); 
      for (var i = 0; i < obj.businesses.length; i++){
        console.log(obj.businesses[i].name);
        if(obj.businesses[i].name === req.query.name){
          res.send(obj.businesses[i]);
          console.log('selected ', obj.businesses[i].name, obj.businesses[i].location);
          return;
        }
      }
    res.send(!!obj.businesses ? obj.businesses[0] : 'Try Again');
    }
  });
};
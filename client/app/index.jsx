import React from 'react';
var map = window.Map;

class Map extends React.Component {
  //Tests:
  //Calling new Map returns a new object that is a map.
  constructor(props) {
    super(props);
    this.state = {
      startLoc: this.props.startLoc || 'SF',
      waypoints: [],
      current: {}
    };
    this.visited = {};
  }
  
  // make use of React Software Component Lifecycle 
  componentDidMount() {
    this.initMap();
    this.handleNextBar();
  }

  //Setup the Google map objects, these are used later to
  //interact with the map.
  initMap() {
    this.map = new google.maps.Map(this.refs.map, {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(this.refs.panel);

    this.geocoder = new google.maps.Geocoder();
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.stepDisplay = new google.maps.InfoWindow();
  }

  //Re-render the map and directions when the state changes:
  //Tests:
  //The html for the map changes when the state changes?
  componentDidUpdate() {
    if (this.state.waypoints.length > 0) {
      var request = this.getRouteRequest();
      this.directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
          this.directionsDisplay.setDirections(response);
        }
      });
    }
  }

  //Form a request that is sent to the mapping API:
  //Tests:
  //The destination is the furthest location in the waypoints array.
  getRouteRequest() {
    //need to calculate farthest away waypoint and set to endLoc
    var endLoc = this.state.waypoints[this.state.waypoints.length - 1];

    var request = {
      origin: this.state.startLoc,
      destination: endLoc.location,
      travelMode: google.maps.DirectionsTravelMode.WALKING,
      //last waypoint already the destination
      waypoints: this.state.waypoints.slice(0, -1),
      optimizeWaypoints: false
    }

    return request;
  }

  //Called when the user clicks the "Next Bar" button.
  //Adds the next bar to the waypoints array in the state.
  //Tests:
  //The waypoints array has a length of n + 1 or 8 if n was already 8.
  //state.current should be a new bar
  //The address of state.current should be the same as the last location in the waypoints array.
  handleNextBar(e) {
    if (e) {
      e.preventDefault();
    }

    var address;
    if (this.state.waypoints[this.state.waypoints.length - 1]) {
      address = this.state.waypoints[this.state.waypoints.length - 1].location;
    } else if (this.refs.location.value) {
      address = this.refs.location.value;
    } else {
      address = this.state.startLoc;
    }
    
    this.getWaypoints(address, (results) => {
      this.setState({
        waypoints: results.waypoints.slice(0, 7),
        current: results.current
      }, () => console.log(this.state.current));
    });
  }

  //Called when the user clicks the "Find >" button.
  //Sets a new starting location and clears the current
  //waypoints.
  //Tests:
  //state.startLoc equals the submited value
  //The waypoints array has a length of 1
  handleLocationSubmit(e) {
    e.persist();
    var startLoc = this.refs.location.value;
    this.setState({
      startLoc: startLoc,
      waypoints: [],
    }, () => {
      this.visited = {};
      this.handleNextBar(e);
    });
  }

  //Called when the user clicks the "Next Bar" button.
  //Removes the last waypoint from the state and then finds
  //an alternate bar which has not been visited yet.
  //Tests:
  //There is a new bar in the waypoints.
  //The previous bar is not in the waypoints.
  //If there are no bars to change to, it retains the current bar.
  handleChangeBar(e) {
    e.persist();
    this.setState({
      waypoints: this.state.waypoints.slice(0, -1)
    }, () => {
      this.handleNextBar(e);
    });
  }

  //Finds an array of waypoints and passes them to a callback:
  //Tests:
  //Passes results to the callback.
  //No item is in the waypoint array more than once.
  getWaypoints(address, callback) {
    //geocode address into google.maps.LatLng object
    this.geocodeAddress(address, (latLng) => {
      //Construct the request object:
      var request = {
        location: latLng,
        types: ['bar'],
        rankBy: google.maps.places.RankBy.DISTANCE
      }
      //Search for bars near the geocoded location:
      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          //set new waypoint equal to first unvisited bar
          var i = 0;
          while (this.visited[results[i].vicinity]) {
            i++;
            if (!results[i]) {
              break;
            }
          }

          var current = results[i] ? results[i] : this.state.current;

          var waypoint = {
            location: current.vicinity,
            stopover: true
          };

          this.visited[waypoint.location] = true;

          var waypoints = this.state.waypoints.concat(waypoint);

          var results = {
            waypoints: waypoints,
            current: current
          };

          callback(results);
        }
      });
    });
  }

  //Geocodes an address and passes the associated latitude and longitude
  //to a callback.
  //Tests:
  // Geocache Hack Reactor's website, verify that it finds the correct longitude and latitude.
  geocodeAddress(address, callback) {
    this.geocoder.geocode({
      address: address
    }, (results, status) => {
      if (status === 'OK') {
        callback(results[0].geometry.location);
      }
    });
  }

  //Render the map:
  render() {
    const mapStyle = {
      height: 500,
      width: 950,
    };
    
    const mapDivStyle = {
      border: '1px solid black',
      display: 'table',
      margin: '0 auto',
    }

    return (      
    	<div className="row">
        <div className="col s12 m4 l3">
          <div> 
            
            <div>
              <button className="btn waves-effect waves-light btn-large red lighten-2 z-depth-5" type="submit" name="action"
              onClick={this.handleNextBar.bind(this)}>Next Bar</button>
            </div>
             
            <div>
              <button className="btn waves-effect waves-light btn-large red lighten-2 z-depth-5" type="submit" name="action" 
              onClick={this.handleChangeBar.bind(this)}>Change Current Bar</button>
            </div>
          
          </div>
          
          <div>
            
            <form onSubmit={this.handleLocationSubmit.bind(this)}>
              <span>
              <input placeholder="Your location" type="text" ref="location"/>
              </span>
              <button className="btn waves-effect waves-light red lighten-2 z-depth-5" type="submit" name="action">Find
                <i className="material-icons right">send</i>
              </button>

            </form>
          
          </div>
        
        </div>

        <div className="col s12 m8 l9">
          
          <div style={mapDivStyle}> 
  	        <div ref="map" style={mapStyle}>I should be a map!</div>
  	      </div>
       
        </div>
  	      
        <div className="col s12 m12 l12">
					<div id="directions-panel" ref="panel"></div>
				</div>
      </div>
    );
  }
}

module.exports = Map;
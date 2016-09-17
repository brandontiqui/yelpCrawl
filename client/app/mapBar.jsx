import React from 'react';
import {Map, Marker, InfoWindow} from 'google-maps-react'


class mapBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
		};
	}

	onMarkerClick(props, marker, e) {
		console.log('clicked marker');
		console.log('props: ', props);
		console.log('marker: ', marker);

		this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
	}

	onMapClicked (props) {
		if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  console.log('map clicked');
	}


  render () {
  	const mapStyle = {
      height: 500,
      width: 1600
    };

    const mapDivStyle = {
      border: '1px solid black',
      display: 'table',
      margin: '0 auto',
    }


  var markers = [];
  var popups = [];
  for (var i = 0; i < this.props.waypoints.length; i++) {
  	var bar = this.props.waypoints[i];
    markers.push(
      <Marker

		 position={{
		   lat: bar.location.coordinate.latitude,
		   lng: bar.location.coordinate.longitude
		 }}
		 onClick={ this.onMarkerClick.bind(this) } 
		 name={'Current location'} />
		 	
    );

    popups.push(
      <InfoWindow
		 	  onClose={this.onInfoWindowClose}
		 	  marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}>
            <div>
              <h5>{ bar.name }</h5>
              <span>{ bar.location.address }</span>
            </div>
		 	</InfoWindow>		 	
    );
  }

  var places = [];
  for (var i = 0; i < this.props.waypoints.length; i++) {
  	places.push( markers[i] );
  	places.push( popups[i] );
  }

  return (
  		<div>
        <div href="/#/directions" className="bottom select-go-to-map center-align thin">
          <a href="/#/directions" className="to-map">Get Directions</a>
        </div>
  		<div className="map">
  		<Map google={window.google}
     style={mapStyle}
     className = "map-styles"
     onClick={this.onMapClicked.bind(this)}
     >
          { places }

      </Map>
      </div>
      </div>
  );
  }
};


export default mapBar;

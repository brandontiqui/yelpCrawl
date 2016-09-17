import React from 'react';
import {Map, Marker, InfoWindow, Listing} from 'google-maps-react'


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


 //  render () {
 //  return (
 //    <div>
 //      <Map google={window.google} onClick={this.onMapClicked.bind(this)}>
	// {this.props.waypoints.map(bar => {
	//    return (
	//      <Marker
	// 	 position={{
	// 	   lat: bar.location.coordinate.latitude,
	// 	   lng: bar.location.coordinate.longitude
	// 	 }}
	// 	 onClick={ this.onMarkerClick.bind(this) } 
	// 	 name={'Current location'} >

	// 	 	<InfoWindow
	// 	 	  onClose={this.onInfoWindowClose}
	// 	 	  marker={this.state.activeMarker}
 //        visible={this.state.showingInfoWindow}>
 //            <div>
 //              <h1>test</h1>
 //            </div>
	// 	 	</InfoWindow>
		 
	// 	  </Marker>
	//    );
	//  })}

 //      </Map>
	    
 //    </div>
 //  );
 //  }

  render () {
  return (

	{this.props.waypoints.map(bar => {
	   return (
      <Map google={window.google} onClick={this.onMapClicked.bind(this)}>
	     <Marker
		 position={{
		   lat: bar.location.coordinate.latitude,
		   lng: bar.location.coordinate.longitude
		 }}
		 onClick={ this.onMarkerClick.bind(this) } 
		 name={'Current location'} />
		 	<InfoWindow
		 	  onClose={this.onInfoWindowClose}
		 	  marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}>
            <div>
              <h5>{ bar.name }</h5>
              <p>some info..</p>
            </div>
		 	</InfoWindow>
      </Map>
	   );
	 })}

	    
  );
  }
};


export default mapBar;

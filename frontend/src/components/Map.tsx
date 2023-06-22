import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapHeader from "./Header"
import "./Map.css"

const Map: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [loadingPosition, setLoadingPosition] = useState(true);

  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setLoadingPosition(false);

        // Create a marker for the user's location
        const userLocationIcon = {
          url: "/src/icons/player-icon.png",
          scaledSize: new google.maps.Size(30, 30),
        };

        // Now create a new marker
        new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapRef.current,
            title: 'Your location',
            icon: userLocationIcon
        });
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLoadingPosition(false);
    }
  }, []);

  const initialize = () => {
    let mapColour = '#E4D3FF'
    let roadColour = "#FFFFFF"
    if (!loadingPosition && isLoaded) {
      mapRef.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: location,
        zoom: 17,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'poi', //remove icons 
            stylers: [{ visibility: 'off' }]
          }, {
            featureType: "transit.station.bus", // remove bus stops 
            stylers:  [{ "visibility": "off" }]
          }, 
          {
            featureType: 'road', //remove road names
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          
          // Map Colours  
          { elementType: 'geometry', 
            stylers: [{ color: mapColour }] 
          },
          { elementType: 'labels.text.stroke', 
            stylers: [{ color: mapColour }] 
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: roadColour }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: roadColour }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: roadColour }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: roadColour }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: roadColour }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: roadColour }]
          }, 
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }]
          }
        ]
      });


      const request: google.maps.places.PlaceSearchRequest = {
        location: location,
        radius: 500,
        type: 'restaurant',
      };

      serviceRef.current = new google.maps.places.PlacesService(mapRef.current);
      serviceRef.current.nearbySearch(request, callback);

      infoWindowRef.current = new google.maps.InfoWindow();
    }
  };

  useEffect(initialize, [loadingPosition, isLoaded]);

  const callback = (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
    }
  };

  const createMarker = (place: google.maps.places.PlaceResult) => {
    // Check if the place has photos
    let iconUrl = (place.photos && place.photos.length > 0) ? place.photos[0].getUrl() : "";

    let ratingHTML = '';
    if (place.rating !== undefined) {
      ratingHTML = `<div class="marker-content-rating">Rating: ${place.rating} &#9733;</div>`;
    }
    // public and private api keys 
    // use own reviews 
    // another page for non-logged in 

    const marker = new google.maps.Marker({
        map: mapRef.current,
        position: place.geometry?.location,
    });

    const contentString = `
      <div class="marker-content-wrapper">
          <div class="marker-content-image-wrapper">
              <img src="${iconUrl}" alt="Photo of ${place.name}" class="marker-content-image" />
          </div>
          <div class="marker-content-description">${place.name}</div>
          ${ratingHTML}
      </div>`;

    // Open the InfoWindow on click
    google.maps.event.addListener(marker, 'click', function () {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapRef.current, marker);
      }
    });

  // Open the InfoWindow on immediately 
  //   const infoWindow = new google.maps.InfoWindow({
  //     content: contentString
  // });

  // // Open the InfoWindow immediately
  // infoWindow.open(mapRef.current, marker);

};

const handleSearch = (place: google.maps.places.PlaceResult) => {
  if (place.geometry && place.geometry.location && mapRef.current) {
    mapRef.current.setCenter(place.geometry.location);
  }
}



  return (
    <>
      <MapHeader onSearch={handleSearch} location={location}/>
      <div className='map-wrapper'>
        <h2>Near you</h2>
        <div id="map" className="map">
          {loadingPosition && 
            <div className="spinner">
              <img src="/src/icons/cyclone-Loading-wheel.png" alt="Loading..." />
            </div>
          }
        </div>
      </div>
    </>
  );

};

export default Map;


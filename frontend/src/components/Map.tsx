import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import "../styles/Map.css"
import { useEateryContext } from '../context/useEateryContext';
import { Eatery, MapProps } from '../interface';
import { getMapStyle } from '../styles/MapStyle';

const Map: React.FC<MapProps> = ({findLocation}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [loadingPosition, setLoadingPosition] = useState(true);
  const { eateries, fetchEateries } = useEateryContext();
  
  // Set default position to user location
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
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

  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);


  // update map view on search 
  useEffect(() => {
    if (findLocation && mapRef.current) {
      mapRef.current.setCenter(findLocation);
    }
  }, [findLocation]);

  const initialize = () => {
    if (!loadingPosition && isLoaded) {
      mapRef.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: userLocation,
        zoom: 17,
        disableDefaultUI: true,
        styles: getMapStyle()
      });
      
      eateries.forEach(eatery => {
        createMarker(eatery);
      });
     
    }
  };

  useEffect(initialize, [loadingPosition, isLoaded, eateries]);

  const createMarker = (eatery: Eatery) => {
    const marker = new google.maps.Marker({
      map: mapRef.current,
      position: { lat: eatery.latitude, lng: eatery.longitude },
    });

    const contentString = `<div>${eatery.restaurant_name}</div>`;

    // Open the InfoWindow on click
    google.maps.event.addListener(marker, 'click', function () {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapRef.current, marker);
      }
    });
  };

  return (
    <>
      <div className='map-wrapper'>
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


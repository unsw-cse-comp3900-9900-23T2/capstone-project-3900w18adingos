import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
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
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLoadingPosition(false);
    }
  }, []);

  const initialize = () => {
    if (!loadingPosition && isLoaded) {
      mapRef.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: location,
        zoom: 17,
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
    const marker = new google.maps.Marker({
      map: mapRef.current,
      position: place.geometry?.location,
    });

    google.maps.event.addListener(marker, 'click', function (this: google.maps.Marker) {
      if (infoWindowRef.current) {
        infoWindowRef.current.setContent(`<div>Loading...</div>`);
        infoWindowRef.current.open(mapRef.current, this);
      }
    });
  };

  

  return (
    <div id="map" className="map">
    {loadingPosition && 
      <div className="spinner">
        <img src="../cyclone-Loading-wheel.png" alt="Loading..." />
      </div>
    }
  </div>
  );
};

export default Map;

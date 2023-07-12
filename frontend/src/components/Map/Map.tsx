import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import "./Map.css"
import { useEateryContext } from '../../hooks/useEateryContext';
import { getMapStyle } from './MapStyle';
import { createMarker } from '../Marker/Marker';
import { setUpLocation } from '../../utils/locations';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useNavigate } from 'react-router-dom';

const Map: React.FC = () => {
  const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [loadingPosition, setLoadingPosition] = useState(true);
  const { eateries, fetchEateries, getAllReviews } = useEateryContext();
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();
  
  useEffect(() => {
    setUpLocation(setUserLocation, setLoadingPosition, mapRef);
  }, []);

  useEffect(() => { 
    fetchEateries()
  },[fetchEateries])

  const initialize = async () => {
    if (!loadingPosition && isLoaded) {
      mapRef.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: userLocation,
        zoom: 17,
        disableDefaultUI: true,
        styles: getMapStyle()
      });
      infoWindowRef.current = new google.maps.InfoWindow();

      const map = mapRef.current;
      const infoWindow = infoWindowRef.current
      const markers = await Promise.all(eateries.map(async eatery => { 
        const marker = await createMarker({eatery, map, infoWindow, navigate, getAllReviews});
        return marker;
      }));

      new MarkerClusterer({map, markers})
    }
  };

  useEffect(() => {
    initialize();
  }, [loadingPosition, isLoaded]);

  return (
    <>
      <div className='map-wrapper'>
        <div id="map" className="map">
          {loadingPosition && 
            <div className="spinner">
              <img src="/src/assets/cyclone-Loading-wheel.png" alt="Loading..." />
            </div>
          }
        </div>
      </div>
    </>
  );
};



export default Map;

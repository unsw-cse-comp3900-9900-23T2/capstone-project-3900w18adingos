import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import "./Map.css"
import { useEateryContext } from '../../hooks/useEateryContext';
import { getMapStyle } from './MapStyle';
import { createMarker } from '../Marker/Marker';
import { setUpLocation } from '../../utils/locations';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { useLocation, useNavigate } from 'react-router-dom';
import getDistance from 'geolib/es/getDistance';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

const Map: React.FC = () => {

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
  const location = useLocation();
  
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

    map.addListener('bounds_changed', async function() {
      const bounds = map.getBounds();
      if (!bounds) { 
        return
      }
      const visibleEateries = eateries.filter(eatery => 
        bounds.contains({ lat: eatery.latitude, lng: eatery.longitude })
      );


      const markers = await Promise.all(visibleEateries.map(async eatery => { 
        
        let distance = getDistance(userLocation, {lat: eatery.latitude, lng: eatery.longitude}, 100)
        
        let image = null;
        if (eatery.eatery_image && eatery.eatery_image[0]) {
          image = await getEateryImage(eatery.eatery_image[0]);
        }

        let measurementUnit = "m"
        if (distance >= 1000) { 
          distance = distance / 1000
          measurementUnit = "km"
        } 

        const marker = await createMarker({eatery, map, infoWindow, navigate, distance, image, measurementUnit});
        return marker;
      }));

      new MarkerClusterer({map, markers, renderer})
    });
  }
};

  useEffect(() => {
    initialize();
  }, [loadingPosition, isLoaded]);
  
  useEffect(() => {
    if (location.state?.eatery && mapRef.current) {
      const eatery = location.state.eatery;
      mapRef.current.setCenter(new google.maps.LatLng(eatery.latitude, eatery.longitude));
    }
  }, [location, isLoaded, loadingPosition]);

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

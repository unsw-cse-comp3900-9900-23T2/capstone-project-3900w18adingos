import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import "./Map.css"
import { useEateryContext } from '../../hooks/useEateryContext';
import { MapProps } from '../../interface';
import { getMapStyle } from './MapStyle';
import Marker from '../Marker/Marker';
import { setUpLocation } from '../../utils/locations';

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
  const [markers, setMarkers] = useState<JSX.Element[]>([]);

  // Set default position to user location
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  
  useEffect(() => {
    setUpLocation(setUserLocation, setLoadingPosition, mapRef);
  }, []);

  useEffect(() => {
    if (findLocation && mapRef.current) {
      mapRef.current.setCenter(new google.maps.LatLng(findLocation.latitude, findLocation.longitude));
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
      infoWindowRef.current = new google.maps.InfoWindow();
      fetchEateries();
    }
  };

  useEffect(() => {
    initialize();
  }, [loadingPosition, isLoaded]);

  useEffect(() => {
    if(mapRef.current !== null && infoWindowRef.current !== null) {
      setMarkers(eateries.map(eatery => (
        <Marker key={eatery.id} eatery={eatery} map={mapRef.current} infoWindow={infoWindowRef.current} />
      )));
    }
  }, [ eateries, mapRef.current, infoWindowRef.current]);

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
      {markers}
    </>
  );
};

export default Map;

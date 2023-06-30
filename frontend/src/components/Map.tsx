import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import "../styles/Map.css"
import { useEateryContext } from '../context/useEateryContext';
import { Eatery, MapProps, Review } from '../interface';
import { getMapStyle } from '../styles/MapStyle';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

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
  const {getAllReviews, allReviews} = useEateryContext();
  const navigate = useNavigate()
  
  // Set default position to user location
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoadingPosition(false);

        // For demo
        const lat = -33.9217416169076
        const lng = 151.22720259038303
        setUserLocation({lat: lat, lng: lng})

        // Create a marker for the user's location
        const userLocationIcon = {
          url: "/src/icons/player-icon.png",
          scaledSize: new google.maps.Size(30, 30),
        };
        new google.maps.Marker({
            position: userLocation,
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
      eateries.forEach(eatery => {
        createMarker(eatery);
      });
    }
  };

  useEffect(initialize, [loadingPosition, isLoaded, eateries]);

  const infoWindow = new google.maps.InfoWindow();
  const createMarker = async (eatery: Eatery) => {
      // console.log(eatery.id)
      const marker = new google.maps.Marker({
        map: mapRef.current,
        position: { lat: eatery.latitude, lng: eatery.longitude },
      });
    
      let totalRating = 0;
      let averageRating;
      const reviews = await getAllReviews(eatery.id);  
      if (reviews) { 
        totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = (totalRating / reviews.length) / 2;
        averageRating = Math.round(averageRating * 10) / 10;
      }
  
      const contentString = 
      `<div id="content" class="marker-content-wrapper"> 
        <div class="marker-content-description">
          <h3 id="firstHeading" class="firstHeading">${eatery.restaurant_name}</h3>
          <p>Cusine</p>
          <p>Rating: ${averageRating}</p>
        </div>
      </div>`;
    
      // Open the InfoWindow on click
      google.maps.event.addListener(marker, 'click', function () {
        // Update the content and open the global InfoWindow
        infoWindow.setContent(contentString);
        infoWindow.open(mapRef.current, marker);
    
        // Adding a click listener for the whole InfoWindow
        // Using addListenerOnce to make sure we don't bind the same listener multiple times
        google.maps.event.addListenerOnce(infoWindow, 'domready', function () {
          document.getElementById('content')?.addEventListener('click', () => {
            navigate("/auth/profile")
          });
        });
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


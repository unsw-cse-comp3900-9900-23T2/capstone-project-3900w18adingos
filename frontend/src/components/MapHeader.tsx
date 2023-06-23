import React, { useEffect, useRef, useState } from 'react';
import {Autocomplete} from '@react-google-maps/api';
import "../styles/Header.css"

import Profile from './Profile'; 



interface MapHeaderProps {
  location: { lat: number, lng: number };
  onSearch: (place: google.maps.places.PlaceResult) => void;
}

const MapHeader: React.FC<MapHeaderProps> = ({ location, onSearch }) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (searchRef.current) {

      const center = location;

      const defaultBounds = {
        north: center.lat + 0.1,
        south: center.lat - 0.1,
        east: center.lng + 0.1,
        west: center.lng - 0.1,
      };

      const options = {
        
        bounds: defaultBounds,
        componentRestrictions: { country: "aus" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
        types: ["establishment"],
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(searchRef.current, options);


      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          onSearch(place);
        }
      });
    }

    return () => {
      if (searchRef.current) google.maps.event.clearInstanceListeners(searchRef.current);
    };

  }, [onSearch, location]);

  return (
    <div className={isProfileOpen ? "account-page-open": "map-header"}>

      <Profile openProfile={isProfileOpen} closeProfile={() => setIsProfileOpen(false)} /> 
      <div className='text-header'>
        <h1>Discover places and restaurants</h1>
        <button className='profile-button' onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <i className='glyphicon glyphicon-user' /> 
        </button>
      </div>
      <input ref={searchRef} type="text" placeholder="Search location" className='search-bar'/>
    </div>
  );
};

export default MapHeader;

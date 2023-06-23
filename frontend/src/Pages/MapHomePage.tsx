// MapHomePage component
import React, { useState } from 'react';
import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import Profile from '../components/Profile';
import "../styles/Profile.css"

import "@react-google-maps/api"; 

const MapHomePage: React.FC = () => { 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState({ lat: 0, lng: 0 });

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      setSearchLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  }

  const handleProfileOpen = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return ( 
    <>
      <Header>  
        <div className='text-header'>
          <h1>Discover places and restaurants</h1>
          {isProfileOpen && <Profile openProfile={isProfileOpen} closeProfile={handleProfileOpen} />}
          <button className='profile-button' onClick={handleProfileOpen}>
              <i className='glyphicon glyphicon-user' /> 
          </button>
        </div>

        <SearchBar location={searchLocation} onSearch={handleSearch} />
      </Header>
      
      <Map searchLocation={searchLocation} />
    </>
);
}


export default MapHomePage;

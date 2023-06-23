// MapHomePage component
import React, { useState } from 'react';
import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import "../styles/Profile.css"
import { useNavigate } from 'react-router-dom';

import "@react-google-maps/api"; 

const MapHomePage: React.FC = () => { 
  const [searchLocation, setSearchLocation] = useState({ lat: 0, lng: 0 });

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      setSearchLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  }

  const navigate = useNavigate(); 
  const handleProfileOpen = () => {
    navigate('/profile');
  };

  return ( 
    <>
      <Header>  
        <div className='text-header'>
          <h1>Discover places and restaurants</h1>
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

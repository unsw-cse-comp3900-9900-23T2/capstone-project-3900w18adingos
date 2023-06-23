// MapHomePage component
import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import "../styles/Profile.css"
import { useNavigate, Link } from 'react-router-dom';

import "@react-google-maps/api"; 
import Footer from '../components/Footer';

const MapHomePage: React.FC = () => { 
  const [searchLocation, setSearchLocation] = useState({ lat: 0, lng: 0 });

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      setSearchLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  }

  const handleProfileOpen = () => {
    const navigate = useNavigate(); 
    useEffect(() => { 
      navigate('/profile');
    })
  };

  return ( 
    <>
      <Header>  
        <div className='text-header'>
          <h1>Discover places and restaurants</h1>
          <Link to="/profile">
            <button className='profile-button' >
                <i className='glyphicon glyphicon-user' /> 
            </button>
          </Link>  
        </div>

        <SearchBar location={searchLocation} onSearch={handleSearch} />
      </Header>
      
      
      <Map findLocation={searchLocation} />
      <Footer />
    </>
);
}

export default MapHomePage;

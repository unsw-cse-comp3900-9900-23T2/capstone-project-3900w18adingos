// MapHomePage component
import React, {useState } from 'react';
import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";

import "@react-google-maps/api"; 
import Footer from '../components/Footer';

const MapHomePage: React.FC = () => { 
  const [searchLocation, setSearchLocation] = useState({ lat: 0, lng: 0 });

  const handleSearch = (place: google.maps.places.PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      setSearchLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  }

  return ( 
    <>
      <Header>  
        <h1>Discover places and restaurants near you</h1>
        <SearchBar location={searchLocation} onSearch={handleSearch} /> 
      </Header>

      <Map findLocation={searchLocation} />
      <Footer />
    </>
);
}

export default MapHomePage;

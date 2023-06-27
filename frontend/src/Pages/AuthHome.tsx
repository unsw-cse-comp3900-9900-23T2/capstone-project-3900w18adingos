// AuthHome component
import React, {useState } from 'react';
import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";

import "@react-google-maps/api"; 
import Footer from '../components/Footer';
import { Eatery } from '../interface';

const AuthHome: React.FC = () => { 
  const [searchLocation, setSearchLocation] = useState<Eatery | null>(null);

  const handleSearch = (place: Eatery) => {
    if (place) {
      setSearchLocation(place);
    }
  }

  return ( 
    <>
      <Header>  
        <h1>Discover places and restaurants near you</h1>
      </Header>
        <SearchBar location={searchLocation} onSearch={handleSearch} /> 
      <Map findLocation={searchLocation} />
      <Footer />
    </>
);
}

export default AuthHome;
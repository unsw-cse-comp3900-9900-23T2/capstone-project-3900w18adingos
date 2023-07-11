// AuthHome component
import React, {useState } from 'react';
import Header from "../components/Header/Header";
import Map from "../components/Map/Map";
import SearchBar from "../components/SearchBar/SearchBar";

import "@react-google-maps/api"; 
import Footer from '../components/Footer/Footer';
import { Eatery } from '../interface';

const AuthHome: React.FC = () => { 
  const [searchLocation, setSearchLocation] = useState<Eatery | null>(null);

  const handleSearch = (place: Eatery) => {
    if (place) {
      setSearchLocation(place);
    }
  }

  return ( 
    <div className='auth-home'>
      <Header>  
        <h3>Discover places and restaurants</h3>
      </Header>
        <SearchBar location={searchLocation} onSearch={handleSearch} /> 
        <h3 className='near-you'>Near You</h3>
      <Map findLocation={searchLocation} />
      <Footer />
    </div>
);
}

export default AuthHome;
// AuthHome component
import React from 'react';
import Header from "../components/Header/Header";
import Map from "../components/Map/Map";
import SearchBar from "../components/SearchBar/SearchBar";

import "@react-google-maps/api"; 
import Footer from '../components/Footer/Footer';

const AuthHome: React.FC = () => { 

  return ( 
    <div className='auth-home'>
      <Header>  
        <h3>Discover places and restaurants</h3>
      </Header>
        <SearchBar /> 
        <h3 className='near-you'>Near You</h3>
      <Map />
      <Footer />
    </div>
);
}

export default AuthHome;
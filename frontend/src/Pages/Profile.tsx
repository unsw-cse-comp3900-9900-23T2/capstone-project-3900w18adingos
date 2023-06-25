import React from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';


const Profile: React.FC = () => {

  return (
    <>
    <Header>
      <h1>Profile Page</h1>
      <i className="glyphicon glyphicon-user" />
    </Header>
    <div className="profile-page">

      <section>
        <h2>Account</h2>
        <ul>
          <li>Personal Information</li>
          <li>Edit Profile</li>
          <li>Language</li>
          <li>Country</li>
        </ul>
      </section>
      <section>
        <h2>General</h2>
        <ul>
          <li>Help</li>
          <li>Touch ID and Password</li>
          <li>Dark Mode</li>
        </ul>
      </section>
      <section>
        <h2>Help and Support</h2>
        <ul>
          <li>Help</li>
          <li>About Us</li>
        </ul>
      </section>
    </div>

    <Footer/>
    </>
  );
};

export default Profile;


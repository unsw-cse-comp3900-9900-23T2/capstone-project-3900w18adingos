import React from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../components/Footer';
import Header from '../components/Header';


const Profile: React.FC = () => {

  return (
    <>
    <Header>
      <h1 >Profile Page</h1>
      <div className='user-icon-wrapper'>
        <i className="glyphicon glyphicon-user" />
      </div>
    </Header>
    <div className="profile-page">
      <div className='profile-content'>
      <section>
        <h3>Account</h3>
        <ul>
          <li>Personal Information</li>
          <li>Edit Profile</li>
          <li>Language</li>
          <li>Country</li>
        </ul>
      </section>
      <section>
        <h3>General</h3>
        <ul>
          <li>Help</li>
          <li>Touch ID and Password</li>
          <li>Dark Mode</li>
        </ul>
      </section>
      <section>
        <h3>Help and Support</h3>
        <ul>
          <li>Help</li>
          <li>About Us</li>
        </ul>
      </section>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default Profile;


import React from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';


const Profile: React.FC = () => {
  const navigate = useNavigate(); 

  const handleClose = () => {
    navigate(-1); // Go back
  };


  return (
    <div className="profile-page">
      <header>
        Profile Page
        <button onClick={handleClose}>X</button> 
      </header>
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
  );
};

export default Profile;

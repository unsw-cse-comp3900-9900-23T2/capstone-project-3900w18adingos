import React from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';

interface ProfileProps {
    openProfile: boolean;
    closeProfile: () => void; // Add this
  }

const Profile: React.FC<ProfileProps> = ({ openProfile, closeProfile }) => {
  return (
    <div className={`profile-page ${openProfile ? 'open' : ''}`}>
      <header>
        Profile Page
        <button onClick={closeProfile}>X</button> 
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

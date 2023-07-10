import React, {useState, useEffect} from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';  // Import useHistory


const Profile: React.FC = () => {
  const { user, logout, fetchUser } = useAuth();
  const [toggleResetPasswordOptions, setToggleResetPasswordOptions] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate("/")
    }
  };
  
  

  return (
    <>
      <Header>
        <h1 >Profile Page</h1>
      </Header>
        <div className='user-icon-wrapper'>
          <i className="glyphicon glyphicon-user" />
        </div>
        
      <div className="profile-page">
        <div className="name">
          <p>{user?.name} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>
        <div className="email">
          <p>{user?.email} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>
        <button onClick={handleLogout} className="logout">Logout</button>
      </div>

      <Footer/>
    </>
  );
};

export default Profile;


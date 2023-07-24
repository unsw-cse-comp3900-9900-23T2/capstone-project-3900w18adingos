import React, { useState, useEffect } from 'react';
import '../../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';  // Import useHistory

const EateryUserProfile: React.FC = () => {

  const { user, logout, passwordResetRequest, passwordReset, fetchUser, updateEateryUser } = useAuth();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [restaurant_name, setRestaurantName] = useState(user?.restaurant_name);
  const [email, setEmail] = useState(user?.email);
  const [toggleResetPasswordOptions, setToggleResetPasswordOptions] = useState(false);
  const [toggleNameOptions, setToggleNameOptions] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  
  const checkToken = localStorage.getItem('token')
  useEffect(() => {
    if (!checkToken) {
      navigate('/');
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }


  const [currentUser, setCurrentUser] = useState({restaurant_name: user?.restaurant_name, email: user?.email});

  useEffect(() => {
    if (user) {
      setRestaurantName(user.restaurant_name)
      setEmail(user.email)
    }
  }, [user]);

  useEffect(() => {
    setCurrentUser({restaurant_name: user?.restaurant_name, email: user?.email});
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate("/")
    }
    navigate("/")
  };

  const handlePasswordResetRequest = async () => {
    if (user) { 
      await passwordResetRequest(user.email, user.role);
    }
  };

  const handlePasswordReset = async () => {
    const result = await passwordReset(resetCode, newPassword);
    if (result) {
    }
  };

  const handleUpdateProfile = async () => {
    if (restaurant_name && email) { 
      const updatedUser = await updateEateryUser(restaurant_name, email);
      if (updatedUser) {
        setCurrentUser({restaurant_name: restaurant_name, email: email});
      }
    }
  };


  return (
    <>
      <Header>
        <h1 >Profile Page</h1>
        <div className='user-icon-wrapper'> 
          <i className="glyphicon glyphicon-user" />
        </div>
      </Header>
      <div className="profile-page">

          <div className="name" onClick={() => {setToggleNameOptions(!toggleNameOptions)}}>
            <p>{currentUser.restaurant_name} </p>
            <i className="glyphicon glyphicon-edit" />
          </div>


          {toggleNameOptions &&
            <div className="toggle-reset-password-container">
              <input type="text" 
                value={restaurant_name} 
                onChange={(e) => setRestaurantName(e.target.value)} 
                className='input-field' placeholder="Enter Name" />
              <input type="email" value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className='input-field' 
                placeholder="Enter Email" />
              <button onClick={handleUpdateProfile} className='submit-button' >Update Profile </button>
            </div>
          }

          <div className="email" onClick={() => { setToggleResetPasswordOptions(!toggleResetPasswordOptions) }}>
            <p>{currentUser.email} </p>
            <i className="glyphicon glyphicon-edit" />
          </div>

          {toggleResetPasswordOptions &&
            <div className="toggle-reset-password-container">
              <div className="reset-code">
                <input type="text" onChange={(e) => setResetCode(e.target.value)} className='input-field' placeholder="Reset Code" />
                <button onClick={handlePasswordResetRequest} className='submit-button'>Send Code</button>
              </div>

              <div className="reset-password">
                <input type="password" onChange={(e) => setNewPassword(e.target.value)} className='input-field' placeholder="New Password" />
                <button onClick={handlePasswordReset} className='submit-button' >Reset Password</button>
              </div>
            </div>
          }

          <button 
            onClick={handleLogout} 
            className="submit-button" 
            style={{"background": "#E07893", "border":"none"}}>
              Logout
          </button>
          
      </div>

      <Footer />
    </>
  );
};

export default EateryUserProfile;

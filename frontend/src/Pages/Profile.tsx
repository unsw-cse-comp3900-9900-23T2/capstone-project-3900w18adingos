import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';  // Import useHistory

const Profile: React.FC = () => {

  const { user, logout, passwordResetRequest, passwordReset, fetchUser, updateProfile } = useAuth();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [toggleResetPasswordOptions, setToggleResetPasswordOptions] = useState(false);
  const [toggleNameOptions, setToggleNameOptions] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);


  const [currentUser, setCurrentUser] = useState({name: user?.name, email: user?.email});

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user]);

  useEffect(() => {
    setCurrentUser({name: user?.name, email: user?.email});
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
    if (name && email) { 
      const updatedUser = await updateProfile(name, email);
      if (updatedUser) {
        setCurrentUser({name: name, email: email});
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
            <p>{currentUser.name} </p>
            <i className="glyphicon glyphicon-edit" />
          </div>


          {toggleNameOptions &&
            <div className="toggle-reset-password-container">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='input-field' placeholder="Enter Name" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input-field' placeholder="Enter Email" />
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

export default Profile;

import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';  // Import useHistory

const Profile: React.FC = () => {
  const { user, logout, passwordResetRequest, passwordReset, fetchUser, updateProfile } = useAuth();  // Get auth functions from context
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

  useEffect(() => {
    if (user) {
      setName(user?.name)
      setEmail(user?.email)
    }
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate("/")
    }
  };

  const handlePasswordResetRequest = async () => {
    if (user) { 
      const result = await passwordResetRequest(user.email, user.role);
    }
  };

  const handlePasswordReset = async () => {
    const result = await passwordReset(resetCode, newPassword);
    if (result) {
    }
  };

  const handleUpdateProfile = async () => {
    if (user) { 
      const result = await updateProfile(user.name, user.email);
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
        <div className='profile-content'>

          <div className="name" onClick={() => {
            debugger
            setToggleNameOptions(!toggleNameOptions)
          }}>
            <p>{user?.name} </p>
            <i className="glyphicon glyphicon-edit" />
          </div>


          {toggleNameOptions &&
            <div className="toggle-reset-password-container">

              <div className="reset-code">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='reset-code-text' placeholder="Enter Name" />
              </div>

              <div className="reset-password">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='reset-code-text' placeholder="Enter Email" />
              </div>
              <div style={{ marginTop: '5px' }}>
                <button onClick={handleUpdateProfile} className='reset-password-button' >Update Profile </button>
              </div>
            </div>
          }

          <div className="email" onClick={() => { setToggleResetPasswordOptions(!toggleResetPasswordOptions) }}>
            <p>{user?.email} </p>
            <i className="glyphicon glyphicon-edit" />
          </div>

          {toggleResetPasswordOptions &&  // this is the conditional rendering
            <div className="toggle-reset-password-container">

              <div className="reset-code">
                <input type="text" onChange={(e) => setResetCode(e.target.value)} className='reset-code-text' placeholder="Reset Code" />
                <button onClick={handlePasswordResetRequest} className='reset-code-button'>Send<br /> Code</button>
              </div>

              <div className="reset-password">
                <input type="password" onChange={(e) => setNewPassword(e.target.value)} className='reset-password-text' placeholder="New Password" />
                <button onClick={handlePasswordReset} className='reset-password-button' >Reset Password</button>
              </div>

            </div>
          }

          <button onClick={handleLogout} className="logout">Logout</button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;

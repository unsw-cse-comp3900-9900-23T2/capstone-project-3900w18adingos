import React, {useState, useEffect} from 'react';
import '../styles/Profile.css';
import '@react-google-maps/api';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';  // Import useHistory


const Profile: React.FC = () => {
  const { user, logout, passwordResetRequest, passwordReset, fetchUser } = useAuth();  // Get auth functions from context
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
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
  
  const handlePasswordResetRequest = async () => {
    const result = await passwordResetRequest(user.email);
    if (result) {
    }
  };
  
  const handlePasswordReset = async () => {
    const result = await passwordReset(resetCode, newPassword);
    if (result) {
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
        
        <div className="name">
          <p>{user?.name} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>

        <div className="email" onClick={() => {setToggleResetPasswordOptions(!toggleResetPasswordOptions)}}>
          <p>{user?.email} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>

        {toggleResetPasswordOptions &&  // this is the conditional rendering
          <div className="toggle-reset-password-container">
            
            <div className="reset-code">
              <input type="text" onChange={(e) => setResetCode(e.target.value)} className='reset-code-text' placeholder="Reset Code" />
              <button onClick={handlePasswordResetRequest} className='reset-code-button'>Send<br/> Code</button>
            </div>

            <div className="reset-password">
              <input type="password" onChange={(e) => setNewPassword(e.target.value)} className='reset-password-text' placeholder="New Password" />
              <button onClick={handlePasswordReset}className='reset-password-button' >Reset Password</button>
            </div>
          
          </div>
          }
      <button onClick={handleLogout} className="logout">Logout</button>
      </div>
    </div>

    <Footer/>
    </>
  );
};

export default Profile;


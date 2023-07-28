import React, { useState, useEffect } from "react";
import "../../styles/Profile.css";
import "@react-google-maps/api";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Import useHistory

const Profile: React.FC = () => {
  const {
    user,
    logout,
    passwordResetRequest,
    passwordReset,
    fetchUser,
    updateProfile,
  } = useAuth();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [toggleNameOptions, setToggleNameOptions] = useState(false);
  const checkToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    name: user?.name,
    email: user?.email,
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    setCurrentUser({ name: user?.name, email: user?.email });
  }, [user]);

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      navigate("/");
    }
    navigate("/");
  };

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

  const handleUpdateProfile = async () => {
    if (name && email) {
      const updatedUser = await updateProfile(name, email);
      if (updatedUser) {
        setCurrentUser({ name: name, email: email });
        setToggleNameOptions(false);
      }
    }
  };
  const handlePasswordResetRequest = async () => {
    if (user) {
      setLoading(true);
      try {
        const success = await passwordResetRequest(user.email, user.role);
        if (success) {
          setMessage(
            "Check your email for the instructions to update your password"
          );
        } else {
          setMessage("Failed to send reset email");
        }
      } catch {
        setMessage("An error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header>
        <h1>Profile Page</h1>
        <div className="user-icon-wrapper">
          <i className="glyphicon glyphicon-user" />
        </div>
      </Header>
      <div className="profile-page">
        <div
          className="name"
          onClick={() => {
            setToggleNameOptions(!toggleNameOptions);
          }}
        >
          <p>{currentUser.name} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>

        <div
          className="email"
          onClick={() => {
            setToggleNameOptions(!toggleNameOptions);
          }}
        >
          <p>{currentUser.email} </p>
          <i className="glyphicon glyphicon-edit" />
        </div>
        {toggleNameOptions && (
          <div className="toggle-reset-password-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter Email"
            />
            <button onClick={handleUpdateProfile} className="submit-button">
              Update Profile{" "}
            </button>
          </div>
        )}

        <div className="toggle-reset-password-container mt-4">
          {message && <p className="text-center">{message}</p>}

          <div className="reset-code">
            <button
              onClick={handlePasswordResetRequest}
              className="submit-button"
            >
              {loading ? "Sending request..." : "Send Password Update Request"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="submit-button"
          style={{ background: "#E07893", border: "none" }}
        >
          Logout
        </button>
      </div>

      <Footer />
    </>
  );
};

export default Profile;

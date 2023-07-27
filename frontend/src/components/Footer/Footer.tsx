import React, { useState } from "react";
import { Link } from "react-router-dom";
import ScanQR from "../../Pages/Eatery/ScannerPopup";
import "./Footer.css";

const Footer: React.FC = () => {
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");

  const [showScannerPopup, setShowScannerPopup] = useState(false);

  const togglePopup = () => {
    setShowScannerPopup((prevState) => !prevState);
  };

  return (
    <div className="footer">
      {userRole === "eatery" ? (
        <>
          <button onClick={togglePopup} className="footer-button">
            <i className="glyphicon glyphicon-qrcode" />
            <span>Scan QR</span>
          </button>

          <Link to={`/restaurant/${userId}`} className="footer-button">
            <i className="glyphicon glyphicon-cutlery" />
            <span>Menu</span>
          </Link>
          <Link to="/eatery/user/profile" className="footer-button">
            <i className="glyphicon glyphicon-user" />
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/restaurant/map" className="footer-button">
            <i className="glyphicon glyphicon-home" />
            <span>Map</span>
          </Link>
          <Link to="/restaurants" className="footer-button">
            <i className="glyphicon glyphicon-list" />
            <span>List</span>
          </Link>
          <Link to="/customer/wallet" className="footer-button">
            <i className="glyphicon glyphicon-usd" />
            <span>Wallet</span>
          </Link>
          <Link to="/profile" className="footer-button">
            <i className="glyphicon glyphicon-user" />
            <span>Profile</span>
          </Link>
        </>
      )}

      {/* Scanner Popup */}
      {showScannerPopup && (
        <ScanQR isOpen={showScannerPopup} onClose={togglePopup} />
      )}
    </div>
  );
};

export default Footer;

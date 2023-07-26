import React from 'react';
import { Link } from 'react-router-dom';

import './Footer.css';

const Footer: React.FC = () => {
  const userRole = localStorage.getItem('role')
  return (
    <div className="footer">
      {userRole === 'eatery' ?
        <>
          <Link to="/customer/wallet" className="footer-button">
            <i className="glyphicon glyphicon-qrcode" />
            <span>Scan QR</span>
          </Link>
          <Link to="/restuarant/1" className="footer-button">
            <i className="glyphicon glyphicon-cutlery" />
            <span>Menu</span>
          </Link>
          <Link to="/eatery/user/profile" className="footer-button">
            <i className="glyphicon glyphicon-user" />
            <span>Profile</span>
        </Link>
        </>
      :
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
  }
    </div>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <Link to="/home" className="footer-button">
        <i className="glyphicon glyphicon-home" />
        <span>Home</span>
      </Link>
      <Link to="/list" className="footer-button">
        <i className="glyphicon glyphicon-list" />
        <span>List</span>
      </Link>
      <Link to="/wallet" className="footer-button">
        <i className="glyphicon glyphicon-usd" />
        <span>Wallet</span>
      </Link>
      <Link to="/profile" className="footer-button">
        <i className="glyphicon glyphicon-user" />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default Footer;

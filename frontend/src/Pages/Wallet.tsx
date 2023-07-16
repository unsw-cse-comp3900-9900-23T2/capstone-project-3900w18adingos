import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/Wallet.css";
import qrCode from "../assets/qr-code.png";
import Footer from '../components/Footer/Footer';
import Header from "../components/Header/Header";

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const checkToken = localStorage.getItem('token');

  useEffect(() => {
    if (!checkToken) {
      navigate('/');
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

  const [openStarBucks, setOpenStarBucks] = useState(false);
  const [openStellinis, setOpenStellinis] = useState(false);

  return (
    <>
      <Header>
        <h3>My Wallet</h3>
      </Header>
      <div className="wallet">
        <div className="qr-code-img">
          <img src={qrCode} alt="qr code" />
        </div>
        <div className="wallet-accordian">
          <Button onClick={() => setOpenStarBucks(!openStarBucks)}>
            Star Bucks
            <div className="ratings">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
              <i className="bi bi-star-half"></i>
            </div>
          </Button>
          <Collapse in={openStarBucks}>
            <Card>
              <Card.Body>
                <h3>Star Bucks</h3>
                <div className="ratings">
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-fill"></i>
                  <i className="bi bi-star-half"></i>
                  <i className="bi bi-star-half"></i>
                </div>
                <div className="panel-body-meta">
                  <h6>My Vouchers</h6>
                  <div className="panel-body-content">
                    <p>10% off any coffee</p>
                    <p>25% off lunch offer 2pm</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Collapse>

          <Button onClick={() => setOpenStellinis(!openStellinis)}>
            Stellini's
            <div className="ratings">
              <strong>2517 pts</strong>
            </div>
          </Button>
          <Collapse in={openStellinis}>
            <Card>
              <Card.Body>
                <h3>Stellini's</h3>
                <div className="ratings">
                  <strong>2517 pts</strong>
                </div>
                <div className="panel-body-meta">
                  <h6>My Vouchers</h6>
                  <div className="panel-body-content">
                    <p>10% off any coffee</p>
                    <p>25% off lunch offer 2pm</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Collapse>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wallet;

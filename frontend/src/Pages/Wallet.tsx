import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/Wallet.css";
import qrCode from "../assets/qr-code.png";
import Footer from '../components/Footer/Footer';
import Header from "../components/Header/Header";
import { useVoucher } from '../hooks/useVoucher';
import { useAuth } from '../hooks/useAuth';

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

  const { vouchers, fetchVouchers } = useVoucher();
  const { user, fetchUser } = useAuth();

  // This will add an 'open' property to each voucher
  const [vouchersState, setVouchersState] = useState(
    vouchers.map((voucher) => ({ ...voucher, open: false }))
  );

  // call fetchUser once when component is mounted
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // call fetchVouchers once when user data is fetched
  useEffect(() => {
    if (user) {
      fetchVouchers(user.id);
    }
  }, [fetchVouchers, user]);

  // update vouchersState when vouchers data is fetched
  useEffect(() => {
    setVouchersState(vouchers.map((voucher) => ({ ...voucher, open: false })));
  }, [vouchers]);

  // Function to handle opening/closing of a voucher
  const handleVoucherToggle = (index: number) => {
    setVouchersState((prevState) =>
      prevState.map((voucher, i) =>
        i === index ? { ...voucher, open: !voucher.open } : voucher
      )
    );
  };

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
          {vouchersState.map((voucher, index) => (
            <div key={index}>
              <Button onClick={() => handleVoucherToggle(index)}>
                {voucher.description}
                <div className="ratings">
                  <strong>{voucher.quantity} pts</strong>
                </div>
              </Button>
              <Collapse in={voucher.open}>
                <Card>
                  <Card.Body>
                    <h3>{voucher.description}</h3>
                    <div className="ratings">
                      <strong>{voucher.quantity} pts</strong>
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
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wallet;

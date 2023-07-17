import React, { useState, useEffect } from 'react';
import { Card, Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../styles/Wallet.css";
import qrCode from "../assets/qr-code.png";
import Footer from '../components/Footer/Footer';
import Header from "../components/Header/Header";
import { useVoucher } from '../hooks/useVoucher';
import { useAuth } from '../hooks/useAuth';
import { Eatery, Voucher } from '../interface';
import { useEateryContext } from '../hooks/useEateryContext';

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
  const {fetchEatery} = useEateryContext()

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchVouchers('1'); // AAAAAAAAAAAAAAAAAAAAAAAAAA
    }
  }, [fetchVouchers]);

  type VoucherWithEatery = { voucher: Voucher, open: boolean, eatery: Eatery | null };
  const [vouchersState, setVouchersState] = useState<VoucherWithEatery[]>([]);

  useEffect(() => {
    if (user) {
      fetchVouchers(user.id)
      const vouchersWithEatery = vouchers.map(voucher => ({ voucher, open: false, eatery: null }));
      setVouchersState(vouchersWithEatery);
    };
  }, [fetchVouchers, user]);
  
  useEffect(() => {
    const updateVouchersWithEateries = async () => {
      const vouchersWithEateries = await Promise.all(
        vouchers.map(async voucher => {
          console.log(voucher.eatery_id, "v each")
          const eatery = await fetchEatery((voucher.eatery_id));
          return { voucher, open: false, eatery };
        })
      );
      setVouchersState(vouchersWithEateries);
    };
    updateVouchersWithEateries();
  }, [vouchers, fetchEatery]);

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
                {voucher.voucher.description}
                <div className="ratings">
                  <strong>{voucher.voucher.quantity} pts</strong>
                </div>
              </Button>
              <Collapse in={voucher.open}>
                <Card>
                  <Card.Body>
                    <h3>{voucher.voucher.description}</h3>
                    <h3>{voucher.eatery?.restaurant_name}</h3> /// NAME 
                    <div className="ratings">
                      <strong>{voucher.voucher.quantity} pts</strong>
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

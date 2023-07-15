import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { useAuth } from '../hooks/useAuth';
import { VoucherContext } from '../context/VoucherContext';

const Wallet: React.FC = () => {
  const [vouchers, setVouchers] = useState([]);
  const { user } = useAuth();  // get the user from the auth context
  const customerId = user ? user.id : '';  // get customer id from the user object
  const { fetchVouchers } = useContext(VoucherContext);

  useEffect(() => {
    // Fetch vouchers on component mount
    fetchVouchers(customerId)
      .then((vouchers) => setVouchers(vouchers))
      .catch((error) => console.error(error));
  }, [customerId, fetchVouchers]);

  return (
    <>
      <Header>
        <h1>Your Wallet</h1>
      </Header>
      <div className="wallet-page">
        <QRCode value={customerId.toString()} />
        <h3>Your Vouchers:</h3>
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <Link key={voucher.id} to={`/voucher/${voucher.id}`}>
              <div>
                <h4>{voucher.description}</h4>
                {/* Display other voucher details here */}
              </div>
            </Link>
          ))
        ) : (
          <p>No vouchers available</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wallet;

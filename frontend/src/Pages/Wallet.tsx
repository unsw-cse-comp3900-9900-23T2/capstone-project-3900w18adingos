import "../styles/Wallet.css";
import qrCode from "../assets/qr-code.png";
import Footer from '../components/Footer/Footer';
import Header from "../components/Header/Header";
import { useNavigate } from 'react-router-dom';  // Import useHistory
import { useEffect} from 'react';

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const checkToken = localStorage.getItem('token')

  useEffect(() => {
    if (!checkToken) {
      navigate('/');
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

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
          <div className="panel-group" id="accordion">
            <div className="panel panel-default">
              <div
                className="panel-heading"
                data-toggle="collapse"
                data-parent="#accordion"
                // href="#collapse2"
              >
                <h4 className="panel-title">
                  <a
                    className="accordion-toggle"
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapse2"
                  >
                    Star Bucks
                    <div className="ratings">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <i className="bi bi-star-half"></i>
                    </div>
                  </a>
                </h4>
                <div className="panel-bottom">
                  <h5>10% off Coffee</h5>
                  <span>25%</span>
                </div>
                <i className="bi bi-chevron-down arrow-down"></i>
              </div>
              <div id="collapse2" className="panel-collapse collapse">
                <div className="panel-body">
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
                </div>
              </div>
            </div>
            <div className="panel panel-default">
              <div
                className="panel-heading"
                data-toggle="collapse"
                data-parent="#accordion"
                // href="#collapse3"
              >
                <h4 className="panel-title">
                  <a
                    className="accordion-toggle"
                    data-toggle="collapse"
                    data-parent="#accordion"
                    href="#collapse3"
                  >
                    Stellini's
                    <div className="ratings">
                      <span>2517 pts</span>
                    </div>
                  </a>
                </h4>
                <div className="panel-bottom">
                  <h5>10% off Coffee</h5>
                  <span>free</span>
                </div>
                <i className="bi bi-chevron-down arrow-down"></i>
              </div>
              <div id="collapse3" className="panel-collapse collapse">
                <div className="panel-body">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default Wallet;

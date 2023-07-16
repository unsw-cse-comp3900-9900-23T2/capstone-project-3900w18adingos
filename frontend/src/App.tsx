
import SignUp from "./Pages/SignUp";
import AuthHome from "./Pages/AuthHome"
import Profile from "./Pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import { EateryProvider } from "./context/EateryContext";
import { VoucherProvider } from "./context/VoucherContext";

import RestaurantList from "./Pages/RestaurantList";
import EateryProfile from "./Pages/EateryProfile";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import AddReview from "./Pages/AddReview";
import Wallet from './Pages/Wallet';
import VoucherDetails from './Pages/VoucherDetails';


const App = () => { 
    return ( 
      <div className="app-outer">
        <div className="app-inner">
          <AuthProvider>
            <EateryProvider>
            <VoucherProvider>
              <Router>
                <Routes>

                  {/* Entry Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth/register" element={<SignUp />} />
                  <Route path="/auth/login" element={<SignIn />} />
                  <Route path="/auth/cuisine-form" element={<CuisineForm />} />

                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                  <Route path="/auth/reset-passwod/:code" element={<ResetPassword />} />

                  <Route path="/auth/home" element={<AuthHome />} />
                  <Route path="/auth/profile" element={<Profile />} />
                  <Route path="/auth/list" element={<RestaurantList />} />
                  <Route path="/eatery/:id" element={<EateryProfile />} />
                  <Route path="/add-review/:id" element={<AddReview />} />

                  <Route path="/auth/wallet" element={<Wallet />} />
                  <Route path="/voucher/:id" element={<VoucherDetails />} />
                </Routes>
              </Router>
              </VoucherProvider>
            </EateryProvider>
          </AuthProvider>
        </div>
      </div>
    );
}

export default App
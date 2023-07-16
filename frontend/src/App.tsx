
import SignUp from "./Pages/SignUp";
import AuthHome from "./Pages/AuthHome"
import Profile from "./Pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import { EateryProvider } from "./context/EateryContext";
import { VoucherProvider } from "./context/VoucherContext";

import RestaurantList from "./pages/RestaurantList";
import EateryProfile from "./pages/EateryProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddReview from "./pages/AddReview";
import Wallet from './Pages/Wallet';
import VoucherDetails from './Pages/VoucherDetails';


const App = () => { 
    return ( 
      <div className="app-outer">
        <div className="app-inner">
          <AuthProvider>
            <EateryProvider>
              <Router>
                <Routes>

                  {/* Entry pages */}
                  <Route path="/auth/register" element={<SignUp />} />
                  <Route path="/auth/login" element={<SignIn />} />

                  <Route path="/" element={<Home />} />


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
            </EateryProvider>
          </AuthProvider>
        </div>
      </div>
    );
}

export default App

import SignUp from "./Pages/Auth/SignUp";
import AuthHome from "./Pages/App/AuthHome"
import Profile from "./Pages/App/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/Auth/SignIn";
import Home from "./Pages/Auth/Home";
import { EateryProvider } from "./context/EateryContext";
import { VoucherProvider } from "./context/VoucherContext";

import RestaurantList from "./Pages/App/RestaurantList";
import EateryProfile from "./Pages/App/EateryProfile/EateryProfile";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import AddReview from "./Pages/App/EateryProfile/AddReview";
import Wallet from './Pages/App/Wallet/Wallet';
import VoucherDetails from './Pages/App/Wallet/VoucherDetails';
import { CuisineForm } from "./Pages/Auth/CuisineForm";


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
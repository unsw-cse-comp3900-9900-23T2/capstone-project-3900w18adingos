
import SignUp from "./Pages/SignUp";
import AuthHome from "./Pages/AuthHome"
import Profile from "./Pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import { EateryProvider } from "./context/EateryContext";

import RestaurantList from "./pages/RestaurantList";
import EateryProfile from "./pages/EateryProfile";
import ResetPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";


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

                  <Route path="/auth/forgot-password" element={<ResetPassword />} />
                  <Route path="/" element={<Home />} />


                  <Route path="/auth/forgot-passwod" element={<ForgotPassword />} />
                  <Route path="/auth/reset-passwod/:code" element={<ResetPassword />} />

                  <Route path="/auth/home" element={<AuthHome />} />
                  <Route path="/auth/profile" element={<Profile />} />
                  <Route path="/auth/list" element={<RestaurantList />} />
                  <Route path="/eatery/:id" element={<EateryProfile />} />
                </Routes>
              </Router>
            </EateryProvider>
          </AuthProvider>
        </div>
      </div>
    );
}

export default App
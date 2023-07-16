
import SignUp from "./pages/SignUp";
import AuthHome from "./pages/AuthHome"
import Profile from "./pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { EateryProvider } from "./context/EateryContext";

import RestaurantList from "./pages/RestaurantList";
import EateryProfile from "./pages/EateryProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AddReview from "./pages/AddReview";
import { CuisineForm } from "./pages/CuisineForm";


const App = () => { 
    return ( 
      <div className="app-outer">
        <div className="app-inner">
          <AuthProvider>
            <EateryProvider>
              <Router>
                <Routes>

                  {/* Entry pages */}
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

                </Routes>
              </Router>
            </EateryProvider>
          </AuthProvider>
        </div>
      </div>
    );
}

export default App
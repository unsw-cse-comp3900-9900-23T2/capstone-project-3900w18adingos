
import SignUp from "./Pages/SignUp";
import AuthHome from "./Pages/AuthHome"
import Profile from "./Pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./Pages/SignIn";
import Home from "./Pages/Home";
import { EateryProvider } from "./context/EateryContext";
import RestaurantList from "./Pages/RestaurantList";
import EateryProfile from "./Pages/EateryProfile";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";

const App = () => { 
    return ( 
      // <div className="app-outer">
      //   <div className="app-inner">
          <AuthProvider>
            <EateryProvider>
              <Router>
                <Routes>
                  <Route path="/auth/register" element={<SignUp />} />
                  <Route path="/auth/login" element={<SignIn />} />
                  <Route path="/auth/forgot-passwod" element={<ForgotPassword />} />
                  <Route path="/auth/reset-passwod/:code" element={<ResetPassword />} />
                  <Route path="/auth/home" element={<AuthHome />} />
                  <Route path="/auth/profile" element={<Profile />} />
                  <Route path="/auth/list" element={<RestaurantList />} />
                  <Route path="/eatery/:id" element={<EateryProfile />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Router>
            </EateryProvider>
          </AuthProvider>
      //   </div>
      // </div>
    );
}

export default App
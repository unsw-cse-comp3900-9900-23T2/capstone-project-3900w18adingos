
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
import ResetPassword from "./pages/ForgotPassword";

const App = () => { 
    return ( 
      // <div className="app-outer">
      //   <div className="app-inner">
          <AuthProvider>
            <EateryProvider>
              <Router>
                <Routes>

                  {/* Entry pages */}
                  <Route path="/auth/register" element={<SignUp />} />
                  <Route path="/auth/login" element={<SignIn />} />
                  <Route path="/auth/forgot-password" element={<ResetPassword />} />
                  <Route path="/" element={<Home />} />

                  <Route path="/auth/home" element={<AuthHome />} />
                  <Route path="/auth/profile" element={<Profile />} />
                  <Route path="/auth/list" element={<RestaurantList />} />
                  <Route path="/eatery/:id" element={<EateryProfile />} />
                </Routes>
              </Router>
            </EateryProvider>
          </AuthProvider>
      //   </div>
      // </div>
    );
}

export default App
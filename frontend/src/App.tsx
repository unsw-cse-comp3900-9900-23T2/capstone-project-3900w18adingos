import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import AuthHome from "./pages/AuthHome"
import Profile from "./pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { EateryProvider } from "./context/EateryContext";
import RestaurantList from "./pages/RestaurantList";

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
                  <Route path="/auth/home" element={<AuthHome />} />
                  <Route path="/auth/profile" element={<Profile />} />
                  <Route path="/auth/list" element={<RestaurantList />} />
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
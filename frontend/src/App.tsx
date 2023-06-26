import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import AuthHome from "./pages/AuthHome"
import Profile from "./pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./AuthContext";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

const App = () => { 
    return ( 
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/auth/login" element={<SignIn />} />
            <Route path="/auth/home" element={<AuthHome />} />
            <Route path="/auth/profile" element={<Profile />} />
            <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
    );
}

export default App
import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { AuthProvider } from "./AuthContext";
import SignIn from "./pages/SignIn";

const App = () => { 
    return ( 
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/auth/login" element={<SignIn />} />
            <Route path="/auth/home" element={<Home />} />
            <Route path="/auth/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
    );
}

export default App
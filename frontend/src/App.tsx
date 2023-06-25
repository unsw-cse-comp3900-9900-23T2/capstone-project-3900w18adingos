import "./styles/Map.css"
import SignUp from "./Pages/SignUp";
import MapHomePage from "./Pages/MapHomePage"
import Profile from "./Pages/Profile"
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { AuthProvider } from "./AuthContext";

import PrivateRoutes from "./routes/PrivateRoutes";
import SignIn from "./Pages/SignIn";

const App = () => { 
    return ( 
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/auth/register" element={<SignUp />} />
            <Route path="/auth/login" element={<SignIn />} />
            <Route path="/auth/home" element={<MapHomePage />} />
            <Route path="/auth/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>

    );
}

export default App
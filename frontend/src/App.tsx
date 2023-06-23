import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import MapHomePage from "./pages/MapHomePage"
import Profile from "./pages/Profile"
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import SignIn from "./pages/SignIn";
import PrivateRoutes from "./routes/PrivateRoutes";

const App = () => { 
    return ( 
      <Router>
        <div className="App">  
            <ul className="App-header">  
              <li>  
                <Link to="/map">Map Home</Link>  
              </li>  
              <li>  
                <Link to="/Profile">Profile</Link>  
              </li>  
              <li>  
                <Link to="/sign-up">Sign up</Link>  
              </li>  
              <li>  
                <Link to="/sign-in">Sign in</Link>  
              </li>  
            </ul>  
            </div>

        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />

          <Route path="/map" element={<MapHomePage />} />
          
          <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>

    );
}

export default App
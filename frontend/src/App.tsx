import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import MapHomePage from "./pages/MapHomePage"
import Profile from "./pages/Profile"
import { Routes, Route, BrowserRouter} from "react-router-dom";
import SignIn from "./pages/SignIn";

const App = () => { 
    return ( 
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/home" element={<MapHomePage />} />
          
          <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App
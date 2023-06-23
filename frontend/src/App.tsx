import "./styles/Map.css"
import SignUp from "./pages/SignUp";
import MapHomePage from "./pages/MapHomePage"

import { Routes, Route, BrowserRouter} from "react-router-dom";

const App = () => { 
    return ( 
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<MapHomePage />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App
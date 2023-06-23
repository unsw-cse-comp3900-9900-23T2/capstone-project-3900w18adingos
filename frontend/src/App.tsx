import "./components/Map.css"
import Map from "./components/Map"
const App = () => { 
    return ( 
        <>
        <div className="App">
          <header className="App-header">
            <h1>MAAAAAp🇦🇫</h1>
          </header>
          <div className="map-wrapper">
            <Map />
          </div>
        </div>
      </>
    );
}

export default App
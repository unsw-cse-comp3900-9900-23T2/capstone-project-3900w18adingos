import Header from "../components/Header/Header";
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect} from 'react';
import "../styles/RestaurantList.css"
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const RestaurantList = () => { 
  const { eateries, fetchEateries} = useEateryContext();
  const navigate = useNavigate()

  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  return ( 
    <>
    <Header>
      <h3>Lunch near you</h3>
    </Header>
    <div className="list-container">
      {eateries.map((eatery) => (
        <div key={eatery.id} 
          className="list-item"
          onClick={() => {navigate(`/eatery/${eatery.id}`)}}
          style={{cursor: "pointer"}}
        >

          <div className="title-rating-container">
            <h3>{eatery.restaurant_name}</h3>
            <div className="rating">
              {eatery.reviews &&
                (eatery.reviews.reduce((prev, current) => prev + current.rating, 0) / eatery.reviews.length)
              }  
            </div>
          </div>

          <p>Cuisines: {eatery.cuisines.map(cuisine => cuisine.cuisine_name).join(", ")}</p>
          <p>Email: {eatery.email}</p>
          {/* <img src={eatery.image} alt={eatery.name}/> */}
          <p>Address: {eatery.location}</p>
        </div>
      ))}
    </div>
    <Footer />
  </>
  );
}

export default RestaurantList

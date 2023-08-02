import Header from "../../components/Header/Header";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useEffect } from "react";
import "../../styles/RestaurantList.css";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getCuisines, getRating } from "../../utils/rating";
import { Eatery } from '../../interface';

const RestaurantList = () => {
  const { eateries, fetchEateries } = useEateryContext();
  const navigate = useNavigate();

  const checkToken = localStorage.getItem("token");
  if (!checkToken) {
    navigate("/");
  }
  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  useEffect(() => {
    if (!checkToken) {
      navigate("/");
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }

  return (
    <>
      <Header>
        <h3>Lunch near you</h3>
      </Header>
      <div className="list-container">
        {eateries.map((eatery) => (
            <RestaurantCard eatery={eatery} key={eatery.id}/>
          ))}
      </div>
      <Footer />
    </>
  );
}

interface CardProps { 
  eatery: Eatery
}

const RestaurantCard: React.FC<CardProps> = ({ eatery }) => {
  const navigate = useNavigate();
  
  return (
    <div
      key={eatery.id}
      className="list-item"
      onClick={() => {
        navigate(`/restaurant/${eatery.id}`);
      }}
      style={{ cursor: "pointer" }}
      >
      <div className="title-rating-container">
        <h3>{eatery.restaurant_name}</h3>
        <div className="rating">
          {eatery.reviews && getRating(eatery.reviews)}
        </div>
      </div>

      <p>
        <strong>Cuisines: </strong> {getCuisines(eatery)}
      </p>
      <p><strong>Email: </strong>{eatery.email}</p>
      {/* <img src={eatery.image} alt={eatery.name}/> */}
      <p><strong>Address: </strong>{eatery.location}</p>
    </div>
  );
};


export default RestaurantList;

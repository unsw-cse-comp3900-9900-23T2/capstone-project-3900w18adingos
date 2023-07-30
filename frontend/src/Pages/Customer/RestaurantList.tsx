import Header from "../../components/Header/Header";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useEffect } from "react";
import "../../styles/RestaurantList.css";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { getCuisines, getRating } from "../../utils/rating";

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
              Cuisines:{" "}
              {getCuisines(eatery)}
            </p>
            <p>Email: {eatery.email}</p>
            {/* <img src={eatery.image} alt={eatery.name}/> */}
            <p>Address: {eatery.location}</p>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default RestaurantList;

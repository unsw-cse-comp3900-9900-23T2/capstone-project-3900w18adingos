import Header from "../components/Header/Header";
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect, useState} from 'react';
import "../styles/RestaurantList.css"
import { Review } from "../interface";
import StarRatings from "react-star-ratings";
import Footer from "../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

interface dict { 
  [key: string]: Review[]
}

const RestaurantList = () => { 
  const { eateries, fetchEateries, getAllReviews } = useEateryContext();
  const [reviews, setReviews] = useState<dict | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  useEffect(() =>   {
    if (eateries.length) {
      const fetchAllReviews = async () => {
        const allReviews: dict = {};
        for (const eatery of eateries) {
          const eateryReviews = await getAllReviews(eatery.id);
          if (eateryReviews) { 
            allReviews[eatery.id] = eateryReviews ;
          }
        }
        setReviews(allReviews);
      }
      fetchAllReviews();
    }
  }, [eateries, getAllReviews]);

  return ( 
    <>
    <Header>
      <h2 className="list-header">Lunch Near you</h2>
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
          {reviews &&
            reviews[eatery.id] &&
            (reviews[eatery.id].reduce((prev, current) => prev + current.rating, 0) / reviews[eatery.id].length / 2)
            }
            
          </div>
          </div>
          <p>{eatery.cuisine}</p>
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

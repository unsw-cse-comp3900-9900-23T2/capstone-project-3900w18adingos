import Header from "../components/Header";
import { useEateryContext } from "../context/useEateryContext";
import { useEffect, useState} from 'react';
import "../styles/RestaurantList.css"
import { Review } from "../interface";

interface dict { 
  [key: string]: Review[]
}

const RestaurantList = () => { 
  const { eateries, fetchEateries, getAllReviews, allReviews } = useEateryContext();
  const [reviews, setReviews] = useState<dict | null>(null);

  useEffect(() => {
    fetchEateries();
  }, [fetchEateries]);

  useEffect(() => {
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
        <h3>Lunch Near you</h3>
      </Header>
      <div className="list-container">
        {eateries.map(eatery => (
          <div key={eatery.id} className="list-item">
            <h2>{eatery.restaurant_name}</h2>
            <p>{eatery.cuisine}</p>
            <p>Email: {eatery.email}</p>
            {/* <img src={eatery.image} alt={eatery.name}/> */}
            <p>Address: {eatery.location}</p>
            <div className="reviews">
              <h3>Reviews:</h3>
              {reviews && reviews[eatery.id] && reviews[eatery.id].map((review, index) => (
                <p key={index}>{review.rating}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      </>
  );
}

export default RestaurantList
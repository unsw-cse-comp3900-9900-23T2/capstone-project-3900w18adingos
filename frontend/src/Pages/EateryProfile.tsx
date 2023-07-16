import Footer from "../components/Footer/Footer";
import { useNavigate, useParams } from 'react-router-dom';
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "../styles/EateryProfile.css"
import { useAuth } from "../hooks/useAuth";

const EateryProfile: React.FC = () => { 
  const { id } = useParams<{ id: string }>();
  const {fetchEatery, eatery} = useEateryContext();
  const [currentTab, setCurrentTab] = useState<'INFO' | 'PHOTOS' | 'REVIEWS'>();
  const {getUserById} = useAuth()
  const [users, setUsers] = useState<{[key: string]: any}>({});
  const navigate = useNavigate()

  useEffect(() => {
    if (id){
      fetchEatery(id);
    }
  }, [fetchEatery]);

  // console.log(eatery?.cuisines[0].cuisine.cuisine_name)

  // get user's name from review[].customer_id
  useEffect(() => {

    if (eatery?.reviews) {
      const userIds = eatery.reviews.map(r => r.customer_id);
      const userPromises = userIds.map(id => getUserById(id));
      Promise.all(userPromises).then(usersData => {
        const usersObj = usersData.reduce((acc, user) => user ? ({...acc, [user.id]: user}) : acc, {});
        setUsers(usersObj);
      });
    }
  }, [eatery, getUserById]);


  let averageRating;
  if (eatery?.reviews) { 
  const allReviews = eatery.reviews
    let totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = (totalRating / allReviews.length) / 2;
    averageRating = Math.round(averageRating * 10) / 10;
  }

  return (
    <>
    <div className="profile-wrapper">
      <div className="profile-header">
        <p>image </p>
      </div>
      <div className="eatery-content">
        <div className="title-rating-container">
          <h3>{eatery?.restaurant_name}</h3>
          <p className="rating">{averageRating ? averageRating: ""}</p>
        </div>
        {/* <p>ASS{eatery?.cuisines[0].cuisine_name}</p> */}
        <p>price in $$$$</p>

        <div className="title-rating-container">
          <p style={{"color":"green"}}>Open Now?</p>
          <button className="add-review" onClick={() => navigate(`/add-review/${id}`)}>Add Review</button>
        </div>

        <div className="info-photos-reviews-button-container">
          <button className="button" onClick={() => setCurrentTab('INFO')}>
            <i className="glyphicon glyphicon-info-sign gl" />
            <p>info</p>
          </button>
          <button className="button" onClick={() => setCurrentTab('PHOTOS')}>
            <i className="glyphicon glyphicon-picture gl" />
            <p>photos</p>
          </button>
          <button className="button" onClick={() => setCurrentTab('REVIEWS')}>
            <i className="glyphicon glyphicon-comment gl" />
            <p>reviews</p>
          </button>
        </div>

      </div>

      {currentTab === 'INFO' && <div>Info Content</div>}
      {currentTab === 'PHOTOS' && <div>Photos Content</div>}
      {currentTab === 'REVIEWS' && (
        <div className="display-reviews">
          {eatery?.reviews.map((review, index) => (
            <div key={index} className="list-item">
              <div>Rating: {review.rating}</div>
              <div>Review: {review.review_text}</div>
              <div>User: {users[review.customer_id]?.name}</div>
            </div>
          ))}
        </div>
      )}

    </div>
      <Footer />
    </>
  );
}

export default EateryProfile
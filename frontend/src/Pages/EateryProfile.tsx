import Footer from "../components/Footer/Footer";
import { useParams } from 'react-router-dom';
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "../styles/EateryProfile.css"
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from 'react-router-dom';  // Import useHistory

const EateryProfile: React.FC = () => { 
  const { id } = useParams<{ id: string }>();
  const {getAllReviews, allReviews,fetchEatery, eatery} = useEateryContext();
  const [currentTab, setCurrentTab] = useState<'INFO' | 'PHOTOS' | 'REVIEWS'>();
  const [users, setUsers] = useState<{[key: string]: any}>({});

  const navigate = useNavigate();
  const checkToken = localStorage.getItem('token')
  if (!checkToken){
    navigate("/")
  }
  const {getUserById} = useAuth()

  useEffect(() => {
    if (id){
      getAllReviews(id);
      fetchEatery(id);
      allReviews.forEach(async (review) => {
        if (!users[review.customer_id]) {
          const user = await getUserById(review.customer_id);
          setUsers(prevUsers => ({
            ...prevUsers,
            [review.customer_id]: user,
          }));
        }
      });
    }
  }, [fetchEatery, getAllReviews, getUserById]);
  

  let totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
  let averageRating = (totalRating / allReviews.length) / 2;
  averageRating = Math.round(averageRating * 10) / 10;

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
        <p>cuisine</p>
        <p>price in $$$$</p>
        <p>Open Now?</p>
        
        <div className="info-photos-reviews-button-container">
          <div className="button" onClick={() => setCurrentTab('INFO')}>
            <i className="glyphicon glyphicon-info-sign gl" />
            <p>info</p>
          </div>
          <div className="button" onClick={() => setCurrentTab('PHOTOS')}>
            <i className="glyphicon glyphicon-picture gl" />
            <p>photos</p>
          </div>
          <div className="button" onClick={() => setCurrentTab('REVIEWS')}>
            <i className="glyphicon glyphicon-comment gl" />
            <p>reviews</p>
          </div>
        </div>
      </div>

      {currentTab === 'INFO' && <div>Info Content</div>}
      {currentTab === 'PHOTOS' && <div>Photos Content</div>}
      {currentTab === 'REVIEWS' && (
        <div className="display-reviews">
          {allReviews.map((review, index) => (
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
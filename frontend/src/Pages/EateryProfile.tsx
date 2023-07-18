import Footer from "../components/Footer/Footer";
import { useNavigate, useParams } from 'react-router-dom';
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "../styles/EateryProfile.css"
import { useAuth } from "../hooks/useAuth";
import { useVoucher } from "../hooks/useVoucher";

const EateryProfile: React.FC = () => { 
  const { id } = useParams<{ id: string }>();

  const {fetchEatery, eatery, deleteReview} = useEateryContext();
  const {getUserById, user, fetchUser} = useAuth()
  const {claimVoucher, fetchVouchersForEatery, eateryVouchers} = useVoucher()

  const [currentTab, setCurrentTab] = useState<'INFO' | 'PHOTOS' | 'REVIEWS' | 'VOUCHERS'>("VOUCHERS");
  const [users, setUsers] = useState<{[key: string]: any}>({});
  const navigate = useNavigate()

  useEffect(() => {
    if (id){
      fetchEatery(id);
    }
    fetchUser()
  }, [fetchEatery, fetchUser]);

  useEffect(() => { 
    if(id) { 
      fetchVouchersForEatery(id)
    }
  },[fetchVouchersForEatery])

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
    averageRating = (totalRating / allReviews.length);
    averageRating = Math.round(averageRating * 10) / 10;
  }

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    if (id) { 
      fetchEatery(id);
    }
  };

  const voucherClaim = async (voucherId: string) => { 
    if (user) { 
      const success = await claimVoucher(voucherId, user.id)
      if (success) { 
        return "Claim successful!"
      }
    }
    return "Claim unsuccessful L"
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
        <p>Cusinies: {eatery && eatery.cuisines.map(cuisine => cuisine.cuisine_name).join(", ")}</p>
        <p>price in $$$$</p>

        <div className="title-rating-container" style={{"height": "40px"}}>
          <p style={{"color":"green"}}>Open Now?</p>
          {currentTab === 'REVIEWS' && (
            <button className="add-review" onClick={() => navigate(`/add-review/${id}`)}>Add Review</button>
          )}
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
          <button className="button" onClick={() => setCurrentTab('VOUCHERS')}>
            <i className="glyphicon glyphicon-credit-card	gl"></i>
            <p>vouchers</p>
          </button>
        </div>

      </div>

      {currentTab === 'INFO' && <div>Info Content</div>}
      {currentTab === 'PHOTOS' && <div>Photos Content</div>}
      {currentTab === 'REVIEWS' && (
        <div className="display-reviews">
          {eatery?.reviews.map((review, index) => (
            <div key={index} className="list-item">
              
              <div className="title-rating-container">
                <div>Rating: {review.rating}</div>
                {user?.id === review.customer_id && (
                  <button onClick={() => handleDeleteReview(review.id)}>
                    <i className="bi bi-trash gl" style={{"padding": "10px"}}></i>
                  </button>
                )}
              </div>

              <div>Review: {review.review_text}</div>
              <div>User: {users[review.customer_id]?.name}</div>

            </div>
          ))}
        </div>
      )}
      {currentTab === 'VOUCHERS' && (
        <div className="display-reviews">
          {eateryVouchers && eateryVouchers.map((voucher, index) => {
            const startDate = new Date(voucher.start);
            const expiryDate = new Date(voucher.expiry);

            return (
              <div key={index} className="list-item">
                <p>Description: {voucher.description}</p>
                <p>Quantity: {voucher.quantity}</p>
                <p>Start: {startDate.toLocaleDateString()}</p>
                <p>Expires: {expiryDate.toLocaleDateString()}</p>
                <button className="claim-voucher" onClick={() => voucherClaim(voucher.id)}>Claim Voucher</button>
              </div>
            );
        })}
        </div>
        )}

    </div>
      <Footer />
    </>
  );
}

export default EateryProfile
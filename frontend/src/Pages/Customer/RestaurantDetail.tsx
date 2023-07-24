import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "../../styles/EateryProfile.css";
import { useAuth } from "../../hooks/useAuth";
import { useVoucher } from "../../hooks/useVoucher";
import { Voucher } from "../../interface";

const EateryProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { fetchEatery, eatery, deleteReview, getEateryImage } =
    useEateryContext();
  const { getUserById, user, fetchUser } = useAuth();
  const {
    claimVoucher,
    fetchVouchersForEatery,
    eateryVouchers,
    fetchVouchers,
    cusomterVouchers,
  } = useVoucher();

  const [currentTab, setCurrentTab] = useState<
    "INFO" | "PHOTOS" | "REVIEWS" | "VOUCHERS"
  >("INFO");
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [coverImage, setcoverImage] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchEatery(id);
    }
    fetchUser();
  }, [fetchEatery, fetchUser]);

  useEffect(() => {
    if (id) {
      fetchVouchersForEatery(id);
      if (user) {
        fetchVouchers(user.id);
      }
    }
  }, [fetchVouchersForEatery, fetchVouchers]);

  useEffect(() => {
    let isMounted = true; // Flag to track the mounted state

    const fetchImages = async () => {
      const urls: string[] = [];
      if (eatery && eatery.eatery_image) {
        for (const imageId of eatery.eatery_image) {
          try {
            const url = await getEateryImage(imageId);
            if (url) {
              urls.push(url);
            }
          } catch (error) {
            console.error(`Failed to fetch image with ID ${imageId}: `, error);
          }
        }
      }

      // The component might unmount before fetching is completed,
      // so we need to check if it's still mounted before updating the state.
      if (isMounted) {
        setImageUrls(urls);
        setcoverImage(urls[0]);
      }
    };

    fetchImages();

    // When the component is about to unmount, set isMounted to false
    return () => {
      isMounted = false;
    };
  }, [getEateryImage, eatery]);

  // get user's name from review[].customer_id
  useEffect(() => {
    if (eatery?.reviews) {
      const userIds = eatery.reviews.map((r) => r.customer_id);
      const userPromises = userIds.map((id) => getUserById(id));
      Promise.all(userPromises).then((usersData) => {
        const usersObj = usersData.reduce(
          (acc, user) => (user ? { ...acc, [user.id]: user } : acc),
          {}
        );
        setUsers(usersObj);
      });
    }
  }, [eatery, getUserById]);

  let averageRating;
  if (eatery?.reviews) {
    const allReviews = eatery.reviews;
    let totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    averageRating = totalRating / allReviews.length;
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
      const success = await claimVoucher(voucherId, user.id);
      if (success) {
        await fetchVouchers(user.id);
        console.log(cusomterVouchers);
        alert("Claim successful!");
        return;
      }
    }
    alert("Claim unsuccessful");
  };

  return (
    <>
      <div className="profile-wrapper">
        {coverImage ? (
          <img src={coverImage} alt="Cover image" className="cover-image" />
        ) : (
          <div className="image-header">
            <i
              className="glyphicon glyphicon-picture"
              style={{ opacity: "40%" }}
            />
          </div>
        )}

        <div className="eatery-content">
          <div className="title-rating-container">
            <h3>{eatery?.restaurant_name}</h3>
            <p className="rating">{averageRating ? averageRating : ""}</p>
          </div>
          <p>
            Cusinies:{" "}
            {eatery &&
              eatery.cuisines
                .map((cuisine) => cuisine.cuisine?.cuisine_name)
                .join(", ")}
          </p>
          <p>price in $$$$</p>
          {eatery?.is_open_now ? (
            <p style={{ color: "green" }}>Open now</p>
          ) : (
            <p style={{ color: "red" }}>Closed</p>
          )}

          <div className="info-photos-reviews-button-container">
            <button
              className="content-button"
              onClick={() => setCurrentTab("INFO")}
            >
              <i className="glyphicon glyphicon-info-sign gl" />
              <p>info</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("PHOTOS")}
            >
              <i className="glyphicon glyphicon-picture gl" />
              <p>photos</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("REVIEWS")}
            >
              <i className="glyphicon glyphicon-comment gl" />
              <p>reviews</p>
            </button>
            <button
              className="content-button"
              onClick={() => setCurrentTab("VOUCHERS")}
            >
              <i className="glyphicon glyphicon-credit-card	gl"></i>
              <p>vouchers</p>
            </button>
          </div>

          {currentTab === "INFO" && eatery && eatery.opening_hours && (
            <div className="info">
              <hr />

              <h4>
                <strong>Address</strong>
              </h4>
              <p>{eatery.location}</p>
              <button
                className="show-eatery"
                onClick={() => navigate("/restaurant/map", { state: { eatery } })}
              >
                Show eatery on map
              </button>

              <hr />

              <h4>
                <strong>Opening Hours</strong>
              </h4>
              <div className="opening-hours">
                {eatery?.opening_hours?.map((obj, index) => (
                  <div className="hour-div">
                    <p key={index}>
                      <strong>{obj.day_of_week}:</strong>{" "}
                      <span className={obj.is_closed ? "closed" : ""}>
                        {obj.is_closed
                          ? "Closed"
                          : `${obj.opening_time} - ${obj.closing_time}`}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {currentTab === "PHOTOS" && (
            <div className="image-grid">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Eatery ${index}`} />
              ))}
            </div>
          )}
          {currentTab === "REVIEWS" && (
            <div className="display-reviews">
              {eatery?.reviews.map((review, index) => (
                <div key={index} className="list-item">
                  <div className="title-rating-container">
                    <div>Rating: {review.rating}</div>
                    {user?.id === review.customer_id && (
                      <button onClick={() => handleDeleteReview(review.id)}>
                        <i
                          className="bi bi-trash gl"
                          style={{ padding: "10px" }}
                        ></i>
                      </button>
                    )}
                  </div>
                  <div>Review: {review.review_text}</div>
                  <div>User: {users[review.customer_id]?.name}</div>
                </div>
              ))}

              <button
                className="add-review"
                onClick={() => navigate(`/add-review/${id}`)}
              >
                Add Review
              </button>
            </div>
          )}
          {currentTab === "VOUCHERS" && (
            <div className="display-reviews">
              {eateryVouchers &&
                eateryVouchers.map((voucher: Voucher, index) => {
                  const startDate = new Date(voucher.start);
                  const expiryDate = new Date(voucher.expiry);
                  const isVoucherClaimed = cusomterVouchers.some(
                    (customerVoucher) => customerVoucher.id === voucher.id
                  );

                  return (
                    <div key={index} className="list-item">
                      <p>Description: {voucher.description}</p>
                      <p>Quantity: {voucher.quantity}</p>
                      <p>Start: {startDate.toLocaleDateString()}</p>
                      <p>Expires: {expiryDate.toLocaleDateString()}</p>
                      <button
                        className="claim-voucher"
                        onClick={() => voucherClaim(voucher.id)}
                        disabled={isVoucherClaimed}
                      >
                        Claim Voucher
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EateryProfile;

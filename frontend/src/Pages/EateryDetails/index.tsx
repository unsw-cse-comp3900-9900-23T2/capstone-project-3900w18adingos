import Footer from "../../components/Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useEateryContext } from "../../hooks/useEateryContext";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import "../../styles/EateryProfile.css";
import { getRating } from "../../utils/rating";
import InfoTab from "./InfoTab";
import PhotosTab from "./PhotosTab";
import ReviewsTab from "./ReviewsTab";
import VouchersTab from "./VouchersTab";
import { UserRole } from "../../interface";

const EateryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { fetchEatery, eatery } = useEateryContext();
  const { user, fetchUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<
    "INFO" | "PHOTOS" | "REVIEWS" | "VOUCHERS"
  >("INFO");
  const [coverImage, setcoverImage] = useState<string>("");
  const { getEateryImage } = useEateryContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEatery(id);
    }
    fetchUser();
  }, [fetchEatery, fetchUser]);

  // load cover image
  useEffect(() => {
    const fetchCoverImage = async () => {
      let coverImageUrl = "";
      if (eatery && eatery.eatery_image && eatery.eatery_image.length > 0) {
        const coverImageId = eatery.eatery_image[0];
        try {
          const url = await getEateryImage(coverImageId);
          if (url) {
            coverImageUrl = url;
          }
        } catch (error) {
          console.error(
            `Failed to fetch cover image with ID ${coverImageId}: `,
            error
          );
        }
      }
      setcoverImage(coverImageUrl);
    };
    fetchCoverImage();
  }, [getEateryImage, eatery]);

  const openCuisine = () => {
    // Pass current selected cuisinesIds
    navigate(
      `/eatery/cuisines?q=${
        eatery &&
        eatery.cuisines.map((cuisine) => cuisine.cuisine?.id).join(",")
      }`
    );
  };

  return (
    <>
      <div className="profile-wrapper">
        <div className="image-header">
          {coverImage ? (
            // Used a div rather than img to set object-fit:cover at a specific height (180px)
            <div
              className="cover-image"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          ) : (
            <i
              className="glyphicon glyphicon-picture"
              style={{ opacity: "40%" }}
            />
          )}
        </div>

        <div className="eatery-content">
          <div className="title-rating-container">
            <h3>{eatery?.restaurant_name}</h3>
            <p className="rating">
              {eatery && eatery.reviews ? getRating(eatery.reviews) : ""}
            </p>
          </div>
          <p>
            Cusinies:{" "}
            {eatery &&
              eatery.cuisines
                .map((cuisine) => cuisine.cuisine?.cuisine_name)
                .join(", ")}{" "}
            {user && user.role === UserRole.EATERY && (
              <i
                className="glyphicon glyphicon-edit"
                style={{ cursor: "pointer" }}
                title="Add/Remove Cuisines"
                onClick={openCuisine}
              />
            )}
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

          {currentTab === "INFO" && eatery && user && (
            <InfoTab user={user} eatery={eatery} />
          )}
          {currentTab === "PHOTOS" && eatery && user && (
            <PhotosTab eatery={eatery} user={user} />
          )}
          {currentTab === "REVIEWS" && eatery && user && (
            <ReviewsTab eatery={eatery} user={user} />
          )}
          {currentTab === "VOUCHERS" && eatery && user && (
            <VouchersTab eatery={eatery} user={user} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EateryDetails;

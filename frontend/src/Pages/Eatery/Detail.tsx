import { useEffect, useState, FormEvent } from "react";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useEateryContext } from "../../hooks/useEateryContext";
import "../../styles/EateryProfile.css";
import { useAuth } from "../../hooks/useAuth";
import { useVoucher } from "../../hooks/useVoucher";
import { Voucher } from "../../interface";
import { getIdFromToken } from "../../utils/jwt123";
import OpenHoursForm from "./OpenHoursForm";
import { CreateOpeningHours } from "../../interface";

interface ImageData {
  imageId: string;
  url: string;
}

// Default open hours data for first time eatery user
const daysOfWeek: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const defaultOpeningTime = "09:00";
const defaultClosingTime = "18:00";

const RestaurantProfile: React.FC = () => {
  const id: number | null = getIdFromToken();
  const [hoursEditable, setHoursEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    fetchEatery,
    eatery,
    deleteReview,
    getEateryImage,
    addImage,
    deleteImage,
    addOpenHours,
  } = useEateryContext();
  const { getUserById, user, fetchUser } = useAuth();
  const {
    fetchVouchersForEatery,
    eateryVouchers,
    fetchVouchers,
    deleteVoucher,
  } = useVoucher();

  const [currentTab, setCurrentTab] = useState<
    "INFO" | "PHOTOS" | "REVIEWS" | "VOUCHERS"
  >("INFO");
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const navigate = useNavigate();

  // Photos state
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const [coverImage, setCoverImage] = useState<ImageData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      fetchEatery(id?.toString());
    }
    fetchUser();
  }, [fetchEatery, fetchUser, id]);

  useEffect(() => {
    if (id) {
      fetchVouchersForEatery(id?.toString());
      if (user) {
        fetchVouchers(user.id);
      }
    }
  }, [fetchVouchersForEatery, fetchVouchers, user, id, eatery]);

  useEffect(() => {
    const fetchImages = async () => {
      const urls: ImageData[] = [];
      if (eatery && eatery.eatery_image) {
        for (const imageId of eatery.eatery_image) {
          try {
            const url = await getEateryImage(imageId);
            if (url) {
              urls.push({ imageId, url });
            }
          } catch (error) {
            console.error(`Failed to fetch image with ID ${imageId}: `, error);
          }
        }
      }
      setImageUrls(urls);
      setCoverImage(urls[0] || null); // Set coverImage to the first image, or null if no images are available.
    };
    fetchImages();
  }, [getEateryImage, eatery?.eatery_image, eatery]);

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
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    averageRating = totalRating / allReviews.length;
    averageRating = Math.round(averageRating * 10) / 10;
  }

  const handleDeleteVoucher = async (voucherId: string) => {
    await deleteVoucher(voucherId);
    if (id) {
      fetchEatery(id?.toString());
    }
  };
  const openCuisine = () => {
    // Pass current selected cuisinesIds
    navigate(
      `/eatery/cuisines?q=${
        eatery &&
        eatery.cuisines.map((cuisine) => cuisine.cuisine?.id).join(",")
      }`
    );
  };

  const handleAddImageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (imageFile) {
      const success = await addImage(imageFile);
      if (success) {
        setLoading(false);
        setImageFile(null);
        if (id) {
          fetchEatery(id?.toString());
        }
      } else {
        console.error("Failed to upload photo");
        setLoading(false);
      }
    } else {
      console.error("No file selected.");
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage(imageId);
    if (id) {
      fetchEatery(id?.toString());
    }
  };

  const initialOpeningHours: CreateOpeningHours[] =
    eatery?.opening_hours && eatery?.opening_hours.length > 0
      ? eatery?.opening_hours // Use eatery.open_hours if it exists, otherwise fallback to default
      : daysOfWeek.map((day) => ({
          eatery_id: id ?? 0, // Replace with the actual eatery_id
          day_of_week: day,
          opening_time: defaultOpeningTime,
          closing_time: defaultClosingTime,
          is_closed: false,
        }));

  const handleHoursFormSubmit = async (data: CreateOpeningHours[]) => {
    if (id) {
      const success = await addOpenHours(data);
      if (success) {
        fetchEatery(id.toString());
        setHoursEditable(!hoursEditable);
      } else {
        console.error("Failed to add voucher");
      }
    }
  };

  return (
    <>
      <div className="profile-wrapper">
        {coverImage ? (
          <img
            src={coverImage?.url}
            alt="Cover image"
            className="cover-image"
          />
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
                .join(", ")} {" "}
            <i
              className="glyphicon glyphicon-edit"
              style={{ cursor: "pointer" }}
              title="Add/Remove Cuisines"
              onClick={openCuisine}
            />
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
                <i
                  className="glyphicon glyphicon-edit"
                  style={{ cursor: "pointer", marginLeft: 10 }}
                  title="Edit Opining Hours"
                  onClick={() => setHoursEditable(!hoursEditable)}
                />
              </h4>
              <div className="opening-hours">
                {hoursEditable ? (
                  <OpenHoursForm
                    initialValues={initialOpeningHours}
                    onSubmit={handleHoursFormSubmit}
                  />
                ) : (
                  eatery?.opening_hours?.map((obj, index) => (
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
                  ))
                )}
              </div>
            </div>
          )}
          {currentTab === "PHOTOS" && (
            <>
              {/* Upload new photos */}
              <form
                onSubmit={handleAddImageSubmit}
                className="menu-image-form-container"
              >
                <label
                  htmlFor="fileInput"
                  className="file-input-label"
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="file"
                    id="fileInput"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={{ display: "none" }}
                  />
                  {imageFile ? imageFile.name : "Choose Photo Here"}
                </label>
                <button type="submit" className="submit-button btn btn-primary">
                  {loading ? "Uploading..." : "Upload Photo"}
                </button>
              </form>

              <hr />
              <div className="image-grid">
                {imageUrls?.map((imgObj, index) => (
                  <div className="menu-image-container" key={index}>
                    <img src={imgObj.url} alt={`Eatery ${index}`} />
                    <i
                      className="bi bi-trash gl"
                      style={{ padding: "10px" }}
                      onClick={() => handleDeleteImage(imgObj.imageId)}
                    ></i>
                  </div>
                ))}
              </div>
            </>
          )}
          {currentTab === "REVIEWS" && (
            <div className="display-reviews">
              {eatery?.reviews.map((review, index) => (
                <div key={index} className="list-item">
                  <div className="title-rating-container">
                    <div>Rating: {review.rating}</div>

                    {/* <button onClick={() => handleDeleteReview(review.id)}>
                      <i
                        className="bi bi-trash gl"
                        style={{ padding: "10px" }}
                      ></i>
                    </button> */}
                  </div>
                  <div>Review: {review.review_text}</div>
                  <div>User: {users[review.customer_id]?.name}</div>
                </div>
              ))}
            </div>
          )}
          {currentTab === "VOUCHERS" && (
            <>
              <a href={`/restaurant/${id}/voucher/add`}>
                <b>+ Add New Voucher</b>
              </a>
              <div className="display-reviews">
                {eateryVouchers &&
                  eateryVouchers.map((voucher: Voucher, index) => {
                    const startDate = new Date(voucher.start);
                    const expiryDate = new Date(voucher.expiry);

                    return (
                      <div key={index} className="list-item">
                        <p>Description: {voucher.description}</p>
                        <p>Quantity: {voucher.quantity}</p>
                        <p>Start: {startDate.toLocaleDateString()}</p>
                        <p>Expires: {expiryDate.toLocaleDateString()}</p>
                        <p>
                          <i
                            className="bi bi-trash gl"
                            style={{ padding: "10px" }}
                            onClick={() => handleDeleteVoucher(voucher.id)}
                          ></i>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RestaurantProfile;

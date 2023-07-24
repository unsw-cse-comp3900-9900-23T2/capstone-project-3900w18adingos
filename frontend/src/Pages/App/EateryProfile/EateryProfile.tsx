import Footer from "../../../components/Footer/Footer";
import { useParams } from 'react-router-dom';
import { useEateryContext } from "../../../hooks/useEateryContext";
import { useEffect, useState } from "react";
import "./EateryProfile.css"
import { useAuth } from "../../../hooks/useAuth";
import { getRating } from "../../../utils/rating";
import { EateryPhotos } from './EateryPhotos';
import { EateryReviews } from "./EateryReviews";
import { EateryVouchers } from "./EateryVouchers";
import { EateryInfo } from "./EateryInfo";

const EateryProfile: React.FC = () => { 
  const { id } = useParams<{ id: string }>();

  const {fetchEatery, eatery} = useEateryContext();
  const {user, fetchUser} = useAuth()
  const [currentTab, setCurrentTab] = useState<'INFO' | 'PHOTOS' | 'REVIEWS' | 'VOUCHERS'>("INFO");
  const [coverImage, setcoverImage] = useState<string>("");
  const { getEateryImage} = useEateryContext();

  useEffect(() => {
    if (id){
      fetchEatery(id);
    }
    fetchUser()
  }, [fetchEatery, fetchUser, user]);

  useEffect(() => {
    let image;
    const getCover = async () => { 
      const firstImage = "1" 
      image = await getEateryImage(firstImage)
    }

    getCover()
    if (image) setcoverImage(image)
    
  }, [eatery])

  return (
    <>
    <div className="profile-wrapper">
      {coverImage ? (
        <img src={coverImage} alt="Cover image" className="cover-image"/>
      ) : (
        <div className="image-header">
          <i className="glyphicon glyphicon-picture" style={{"opacity": "40%"}}/>
        </div>
      )}

      <div className="eatery-content">
        <div className="title-rating-container">
          <h3>{eatery?.restaurant_name}</h3>
          <p className="rating">{eatery && eatery.reviews ? getRating(eatery.reviews): ""}</p>
        </div>
        <p>Cusinies: {eatery && eatery.cuisines.map(cuisine => cuisine.cuisine.cuisine_name).join(", ")}</p>
        <p>price in $$$$</p>
        <p style={{"color": "green"}}>Open now</p>

        <div className="info-photos-reviews-button-container">
          <button className="content-button" onClick={() => setCurrentTab('INFO')}>
            <i className="glyphicon glyphicon-info-sign gl" />
            <p>info</p>
          </button>
          <button className="content-button" onClick={() => setCurrentTab('PHOTOS')}>
            <i className="glyphicon glyphicon-picture gl" />
            <p>photos</p>
          </button>
          <button className="content-button" onClick={() => setCurrentTab('REVIEWS')}>
            <i className="glyphicon glyphicon-comment gl" />
            <p>reviews</p>
          </button>
          <button className="content-button" onClick={() => setCurrentTab('VOUCHERS')}>
            <i className="glyphicon glyphicon-credit-card	gl"></i>
            <p>vouchers</p>
          </button>
        </div>

        {/* {eatery && user && (
          <>
            {currentTab === 'INFO' && <EateryInfo eatery={eatery}/>}
            {currentTab === 'PHOTOS' && <EateryPhotos eatery={eatery} />}
            {currentTab === 'REVIEWS' && <EateryReviews eatery={eatery} user={user} />}
            {currentTab === 'VOUCHERS' && <EateryVouchers eatery={eatery} user={user} />}
          </>
        )} */}

            {/* {currentTab === 'INFO' && eatery && <EateryInfo eatery={eatery}/>} */}
            {currentTab === 'PHOTOS' && eatery && <EateryPhotos eatery={eatery} />}
            {currentTab === 'REVIEWS' && eatery && user && <EateryReviews eatery={eatery} user={user} />}
            {/* {currentTab === 'VOUCHERS' && <EateryVouchers eatery={eatery} user={user} />} */}

        </div>
    </div>
      <Footer />
    </>
  );
}

export default EateryProfile
import Footer from "../components/Footer/Footer";
import { useParams } from 'react-router-dom';
import { useEateryContext } from "../hooks/useEateryContext";
import { useEffect } from "react";
import { getStarRating } from "../utils/rating";

const EateryProfile: React.FC = () => { 
  const { id } = useParams<{ id: string }>();
  const {getAllReviews, allReviews,fetchEatery, eatery} = useEateryContext();
  
  const getData = () => { 
    if (id){
      useEffect(() => {
        getAllReviews(id);
        fetchEatery(id);
      }, [fetchEatery, getAllReviews]);
    }
  }
  getData();

  
  return (
    <>
    <div className="profile-wrapper">
      <div className="profile-header">

      </div>
      <div className="profile-content">
        <h3>{eatery?.restaurant_name}</h3>
        <div dangerouslySetInnerHTML={{__html:  getStarRating(allReviews)}}></div>
      </div>
      <Footer />
    </div>
    </>
  );
}

export default EateryProfile


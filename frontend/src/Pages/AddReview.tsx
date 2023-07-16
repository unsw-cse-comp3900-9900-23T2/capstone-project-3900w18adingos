import { FormEvent, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useEateryContext } from "../hooks/useEateryContext";

const AddReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addReview } = useEateryContext();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (id) { 
      console.log(`${id} ${rating} ${reviewText}`)
      const success = await addReview(id, rating, reviewText);
      if (success) {
        navigate(`/eateries/${id}`);
      } else {
        console.error("Failed to add review");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input type="text" value={rating} onChange={e => setRating(e.target.value)} />
      </label>
      
      <label>
        Review Text:
        <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} />
      </label>

      <button type="submit">Submit Review</button>
    </form>
  );
};

export default AddReview;

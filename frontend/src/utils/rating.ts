import { Review } from "../interface";

export const getStarRating = (reviews: Review[]) =>  {
    let totalRating = 0;
    let averageRating = 0;
    if (reviews) { 
      totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = (totalRating / reviews.length) / 2;
      averageRating = Math.round(averageRating * 10) / 10;
    }
    let stars = '';
    const fullStars = Math.floor(averageRating);
    const halfStar = (averageRating % 1) >= 0.5 ? true : false;
  
    // Append full stars
    for(let i = 0; i < fullStars; i++) {
      stars += '<i class="glyphicon glyphicon-star"></i>'; 
    }
    
    // Append half star if needed
    if (halfStar) {
      stars += '<i class="glyphicon glyphicon-star half"></i>';
    }
    
    return stars;
  };
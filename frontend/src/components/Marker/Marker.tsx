import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEateryContext } from '../../hooks/useEateryContext';
import { Eatery } from '../../interface';
import { getStarRating } from '../../utils/rating';

interface MarkerProps {
  eatery: Eatery;
  map: google.maps.Map | null;
  infoWindow: google.maps.InfoWindow | null;
}

const Marker: React.FC<MarkerProps> = ({ eatery, map, infoWindow }) => {
  const navigate = useNavigate();
  const { getAllReviews } = useEateryContext();

  useEffect(() => {
    const createMarker = async () => {
      if (!map || !infoWindow) return;

      const marker = new google.maps.Marker({
        map,
        position: { lat: eatery.latitude, lng: eatery.longitude },
      });

      const reviews = await getAllReviews(eatery.id);

      const contentString = 
      `<div id="content" class="marker-content-wrapper"> 
        <div class="marker-content-description">
          <h3 id="firstHeading" class="firstHeading">${eatery.restaurant_name}</h3>
          <p>Cusine</p>
          <div class="star-rating">
            <p>${reviews ? getStarRating(reviews): null}</p>
          </div>
        </div>
      </div>`;

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);

        google.maps.event.addListenerOnce(infoWindow, 'domready', function () {
          document.getElementById('content')?.addEventListener('click', () => {
            navigate(`/eatery/${eatery.id}`)
          });
        });
      });
    };

    createMarker();
  }, [eatery, map, infoWindow, navigate, getAllReviews]);

  return null;
};

export default Marker;

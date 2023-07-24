import { useNavigate } from 'react-router-dom';
import { MarkerProps } from '../../interface';
import { getCuisines, getStarRating } from '../../utils/rating';
import "./Marker.css"


export async function createMarker(props: MarkerProps) {
  const { eatery, map, infoWindow} = props;
  const navigate = useNavigate()
  const marker = new google.maps.Marker({
    map,
    position: { lat: eatery.latitude, lng: eatery.longitude },
  });

  const reviews = eatery.reviews
  const contentString = 
    `<div id="content" class="marker-content-wrapper"> 
      <div class="marker-content-description">
        <h3 id="firstHeading" class="firstHeading">${eatery.restaurant_name}</h3>
        <p>Cusines: ${getCuisines(eatery)}</p>
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
        navigate(`/eatery/${eatery.id}`);
      });
    });
  });
  return marker;
}


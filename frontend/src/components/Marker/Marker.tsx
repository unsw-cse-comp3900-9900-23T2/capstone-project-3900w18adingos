import { useNavigate } from 'react-router-dom';
import { Eatery } from '../../interface';
import { getStarRating } from '../../utils/rating';
import "./Marker.css"

interface MarkerProps {
  eatery: Eatery, 
  map: google.maps.Map, 
  infoWindow: google.maps.InfoWindow, 
  navigate: ReturnType<typeof useNavigate>, 
}

export async function createMarker(props: MarkerProps) {
  const { eatery, map, infoWindow, navigate } = props;
  const marker = new google.maps.Marker({
    map,
    position: { lat: eatery.latitude, lng: eatery.longitude },
  });

  const reviews = eatery.reviews
  const contentString = 
    `<div id="content" class="marker-content-wrapper"> 
      <div class="marker-content-description">
        <h3 id="firstHeading" class="firstHeading">${eatery.restaurant_name}</h3>
        <p>Cusines</p>
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


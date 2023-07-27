import { SetUpLocation } from '../interface';

export const setUpLocation: SetUpLocation = (setUserLocation, setLoadingPosition, mapRef) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPosition);

        // For demo
        const lat = -33.9217416169076
        const lng = 151.22720259038303
        setUserLocation({lat: lat, lng: lng})

        // Create a marker for the user's location
        const userLocationIcon = {
          url: "/src/assets/player-icon.png",
          scaledSize: new google.maps.Size(30, 30),
        };
  
        new google.maps.Marker({
          position: userPosition,
          map: mapRef.current,
          title: 'Your location',
          icon: userLocationIcon,
        });
  
        setLoadingPosition(false);
        return userPosition;
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      setLoadingPosition(false);
    }
  };
  
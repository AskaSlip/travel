import { GoogleMap, DirectionsRenderer, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from 'react';

const containerStyle = { width: "100%", height: "500px" };
const center = { lat: 50.4501, lng: 30.5234 }; // Київ
const googleMapsLibraries: ('geometry' | 'places' | 'drawing' | 'visualization')[] = ['geometry'];

const Direction = () => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<number>();

  const getRoute = useCallback(() => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded yet.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
//todo enum for travelMode
    const request: google.maps.DirectionsRequest = {
      origin: 'Kyiv, Ukraine',
      destination: 'Lviv, Ukraine',
      waypoints: [
        { location: 'Zhytomyr, Ukraine', stopover: true },
        { location: 'Rivne, Ukraine', stopover: true },
      ],
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
      // provideRouteAlternatives: true
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirections(result);
        console.log("Оптимізований порядок:", result?.routes[0].waypoint_order);

      } else {
        console.error("Directions request failed:", status);
      }
    });
  }, []);

  useEffect(() => {
    if (directions) {
      const totalDistance = directions.routes[0].legs.reduce(
        (sum, leg) => sum + (leg.distance?.value || 0),
        0
      );

      setDistance(totalDistance / 1000);
      console.log(`Довжина маршруту: ${totalDistance / 1000} км`);
    }
  }, [directions]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      getRoute();
    }
  }, [getRoute]);



  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      onLoad={getRoute} // Викликаємо маршрут, коли API завантажився
      // libraries={googleMapsLibraries}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#1d095a',
                strokeOpacity: 1,
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
      <span>distance in km : {distance}</span>
    </LoadScript>
  );
};

export default Direction;
"use client"
import { FC, useEffect, useRef, useState } from 'react';
import { ITripStop } from '@/models/ITripStop';
import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';

interface IProps {
  tripStops?: ITripStop[];
  setTripStops?: (tripStops: ITripStop[] | ((prev: ITripStop[]) => ITripStop[])) => void

}

const DirectionCreator: FC<IProps> = ({tripStops, setTripStops}) => {


  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);  // для збереження маршруту
  const directionsRenderer = useRef<google.maps.DirectionsRenderer>(null);  // для рендеру маршруту
  const directionsService = useRef<google.maps.DirectionsService>(null);  // для запиту маршруту
  const map = useMap();

  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(google.maps.TravelMode.WALKING);
  const [distance, setDistance] = useState<number>();


  useEffect(() => {
    if (map) {
      directionsService.current = new google.maps.DirectionsService();
      directionsRenderer.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
      directionsRenderer.current.setMap(map);
    }
  }, [map]);


  const calculateRoute = (stops: ITripStop[], mode: google.maps.TravelMode) => {
    if (!directionsService.current || stops.length < 2) return;

    const waypoints = stops.slice(1, stops.length - 1).map((stop) => ({
      location: new google.maps.LatLng(stop.lat, stop.lng),
      stopover: true,
    }));

    const request = {
      origin: new google.maps.LatLng(stops[0].lat, stops[0].lng),
      destination: new google.maps.LatLng(stops[stops.length - 1].lat, stops[stops.length - 1].lng),
      waypoints,
      optimizeWaypoints: true,
      travelMode: mode,

    };

    directionsService.current.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {

        setDirections(result);
        if (directionsRenderer.current) {
          directionsRenderer.current.setDirections(result);
        }


        if(result) {
          const route = result?.routes[0];
          const totalDistance = route?.legs.reduce(
            (sum, leg) => sum + (leg.distance?.value || 0),
            0
          );
          setDistance(totalDistance / 1000);
          console.log(totalDistance / 1000, 'km');
        }
      }
    });
  };

  const getMarkerColor = (index: number, total: number): string => {
    switch (index) {
      case 0:
        return '#4CAF50'; // Origin — зелений
      case total - 1:
        return '#F44336'; // Destination — червоний
      default:
        return '#2196F3'; // Waypoints — синій
    }
  };



  useEffect(() => {
    if (tripStops && tripStops.length > 1 && travelMode) {
      calculateRoute(tripStops, travelMode);
    }
  }, [tripStops, travelMode,setTripStops]);



//todo перенести стилі в окремий файл
  return (
    <>
      <div style={{ position: "absolute", top: 10, right: 100, zIndex: 1000, display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setTravelMode(google.maps.TravelMode.WALKING)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: travelMode === google.maps.TravelMode.WALKING ? '#1a73e8' : '#e0e0e0',
            color: travelMode === google.maps.TravelMode.WALKING ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          🚶‍♂️ Walking
        </button>

        <button
          onClick={() => setTravelMode(google.maps.TravelMode.DRIVING)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: travelMode === google.maps.TravelMode.DRIVING ? '#1a73e8' : '#e0e0e0',
            color: travelMode === google.maps.TravelMode.DRIVING ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          🚗 Driving
        </button>

        <button
          onClick={() => setTravelMode(google.maps.TravelMode.BICYCLING)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: travelMode === google.maps.TravelMode.BICYCLING ? '#1a73e8' : '#e0e0e0',
            color: travelMode === google.maps.TravelMode.BICYCLING ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          🚴‍♀️ Bicycling
        </button>
      </div>


      {tripStops?.map((stop, index) => {
        // const label = String(index + 1);
        const color = getMarkerColor(index, tripStops.length);
        return (
          <AdvancedMarker
            key={stop.id}
            position={{ lat: stop.lat, lng: stop.lng }}
          >
            <Pin
              background={color}
              borderColor="#174ea6"
              glyphColor="white"
              scale={1.3}
              glyph='<3'
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default DirectionCreator;
import { GoogleMap, Marker, useLoadScript, StandaloneSearchBox, Circle } from '@react-google-maps/api';
import { useEffect, useMemo, useRef, useState } from 'react';
//todo розібратись з цією хуйньой
interface GoogleMapsProps {
  className?: string;
  radius: number;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  address: string;
  setAddress: (address: string) => void;
  latitude: number;
  longitude: number;
}

const containerStyle = { width: "100%", height: "500px" };

const GoogleMaps = ({
                      radius,
                      setLatitude,
                      setLongitude,
                      address,
                      setAddress,
                      latitude,
                      longitude,
                    }: GoogleMapsProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const center = useMemo(() => {
    if (isLoaded) {
      return new google.maps.LatLng(latitude, longitude);
    }
    return null;
  }, [latitude, longitude, isLoaded]);


  const changeCoordinate = (coord: google.maps.MapMouseEvent) => {
    const { latLng } = coord;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setLatitude(lat);
      setLongitude(lng);
    } else {
      console.error('LatLng is null or undefined');
    }
  };

  useEffect(() => {
    if (map && isLoaded) {
      map.panTo({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, isLoaded, map]);

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const handlePlaceChanged = () => {
    const [place] = inputRef.current?.getPlaces() ?? [];

    if (place && place.geometry && place.geometry.location) {
      setAddress(place.formatted_address || '');
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  return (
    <div className="relative w-full h-full" style={{ height: '100vh' }}>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          center && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={10}
              onLoad={(map) => setMap(map)}
            >
              <StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
                <div className="absolute z-50 top-4 left-1/2 transform -translate-x-1/2">
                  <input
                    type="text"
                    className="form-control text-black rounded-full bg-amber-50"
                    value={address}
                    placeholder="Enter address"
                    onChange={(e) => setAddress(e.target.value)}
                    style={{
                      padding: '10px',
                      width: '300px',
                      borderRadius: '20px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </StandaloneSearchBox>

              <button
                className="absolute z-50 top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md"
                onClick={() => map?.panTo({ lat: latitude, lng: longitude })}
                style={{
                  padding: '10px',
                  borderRadius: '50%',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
              >
                <span className="text-xs text-black">Click me</span>
              </button>

              <Marker
                draggable
                animation={google.maps.Animation.DROP}
                onDragEnd={changeCoordinate}
                position={{ lat: latitude, lng: longitude }}
              />
            </GoogleMap>
          )
        )}
      </div>
  );
};

export default GoogleMaps;


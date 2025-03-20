import { useRef, useState } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import PoiMarkers from '@/components/Maps/PoiMarkers';

interface ISearchBox {
  setAddress: (address: string) => void;
  address: string;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  latitude: number;
  longitude: number;
}

const SearchBox = ({
  setAddress,
  address,
  setLatitude,
  setLongitude,
  latitude,
  longitude
                   }:ISearchBox) => {
  // const [map, setMap] = useState<google.maps.Map | null>(null);



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
    <div>
    <StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
    <div>
      <input
      type="text"
      value={address}
      placeholder="Enter address"
      onChange={(e) => setAddress(e.target.value)}
      />

    </div>
    </StandaloneSearchBox>
      {/*<button*/}
      {/*onClick={() => {map?.panTo({ lat: latitude, lng: longitude })}}*/}
      {/*></button>*/}
      <button
        onClick={() => {
          if (latitude && longitude) {
            console.log(`Panning to: ${latitude}, ${longitude}`);
          }
        }}
      >Pan to Location</button>
    </div>
    )

}

export default SearchBox;
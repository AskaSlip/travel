"use client"
import { FC, useEffect, useRef } from 'react';

interface IProps {
  onPlaceSelect: (latLng: google.maps.LatLngLiteral, name: string, city: string, county: string) => void;
}

const SearchBox: FC<IProps> = ({ onPlaceSelect })  => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
    autocompleteRef.current.setFields(['geometry', 'name']);

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;

      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
//todo fix later dublicate
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: place.geometry.location }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          const addressComponents = results[0]?.address_components || [];

          const cityComponent = addressComponents.find(c =>
            c.types.includes('locality') || c.types.includes('postal_town')
          );
          const countryComponent = addressComponents.find(c =>
            c.types.includes('country')
          );

          const city = cityComponent?.long_name || 'unknown';
          const country = countryComponent?.long_name || 'unknown';

          onPlaceSelect(latLng, place.name || '', city, country);
        } else {
          console.error("Не вдалося отримати locality");
        }
      });
    });
  }, [onPlaceSelect]);

  return (
    <input
      type="text"
      placeholder="Search location"
      ref={inputRef}
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        width: '300px',
        height: '40px',
        zIndex: 1000,
        padding: '8px',
        fontSize: '16px'
      }}
    />
  );
};

export default SearchBox;

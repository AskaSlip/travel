"use client"
import { FC, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { ICity } from '@/models/ICity';

interface IProps {
  selectedPlace: ((city: ICity) => void);
}

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  libraries: ['places'],
});

const searchBarForPlacesComponent:FC<IProps> = ({selectedPlace})=>  {
  const inputRef = useRef<HTMLInputElement | null>(null);
const autocompleteRef = useRef<google.maps.places.Autocomplete>(null);

  useEffect(() => {
    loader.load().then(() => {
      if(inputRef.current){
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current,{
          types: ['(cities)'],
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current?.getPlace();
          if (place && place.geometry && place.geometry.location) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            const name = place.formatted_address || place.name || '';

            selectedPlace({
              name,
              location,
            })

          }
        });
      }
    })
  }, [selectedPlace]);

  return (
    <input
    ref={inputRef}
    type={"search"}
    placeholder={"Enter the location..."}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
export default searchBarForPlacesComponent;
import { IFilteredPlace } from '@/models/IFilteredPlace';
import { FC } from 'react';

interface IProps {
  placeInfo: IFilteredPlace
}

const FilterPlaceCard: FC<IProps> = ({placeInfo}) => {
  const photoReference = placeInfo.photos?.[0]?.photo_reference;
  const photoUrl = photoReference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}` : '' ;

  return (
    <div className="border-amber-400 border-4 w-80">
      <h2>{placeInfo.name}</h2>
      <p>{placeInfo.vicinity}</p>
      <p>Rating: {placeInfo.rating}<span className="text-yellow-500">★</span></p>
      {photoUrl && (
        <img
          src={photoUrl}
          alt={placeInfo.name}
          className="w-48 h-48 object-cover"
        />
      )}
    </div>
  );
}

export default FilterPlaceCard;
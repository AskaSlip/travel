import { IFilteredPlace } from '@/models/IFilteredPlace';
import { FC } from 'react';
import FilterPlaceCard from '@/components/FilterPlaceCard';

interface IProps {
  places: IFilteredPlace[];
}

const FilterPlaceList: FC<IProps> = ({ places }) => {
  return (
    <div className="flex flex-wrap justify-between">
      {places.map((place, index) => (
          <FilterPlaceCard placeInfo={place} key={index}/>
        ),
      )}
    </div>

  );
};

export default FilterPlaceList;
'use client';
import SearchBarForPlacesComponent from '@/components/SearchBarForPlacesComponent';
import { Suspense, useEffect, useState } from 'react';
import { ICity } from '@/models/ICity';
import RadiusForSearchComponent from '@/components/RadiusForSearchComponent';
import PlaceFilterComponent from '@/components/PlaceFilterComponent';
import { placeCategories } from '@/assets/places-filter.json';
import { IPlaceForFilter } from '@/models/IPlaceForFilter';
import { IFilteredPlace } from '@/models/IFilteredPlace';
import FilterPlaceList from '@/components/FilterPlaceList';
import { Pagination } from 'antd';

const InspirePage = () => {
  const [city, setCity] = useState<ICity | null>(null);
  const [radius, setRadius] = useState<number>(3);
  const [filterValue, setFilterValue] = useState<string>('');
  const [filteredPlaces, setFilteredPlaces] = useState<IFilteredPlace[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationPlaces, setPaginationPlaces] = useState<IFilteredPlace[]>([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    setPaginationPlaces(filteredPlaces.slice(startIndex, endIndex));
  }, [filteredPlaces, currentPage]);

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };
  const totalItems = filteredPlaces.length;


  const categories: IPlaceForFilter = Object.fromEntries(
    Object.entries(placeCategories).map(([category, items]) => [
      category,
      items.map((item) => {
        return {
          name: item.name,
          key: item.key,
        };
      }),
    ]),
  );

  const fetchPlaces = async () => {
    if (!city || !filterValue) {
      alert('Choose a city and a filter category');
      return;
    }

    const res = await fetch(
      `/api/places?lat=${city.location.lat}&lng=${city.location.lng}&radius=${radius}&type=${filterValue}`,
    );
    const data = await res.json();
    console.log(data.results);
    setFilteredPlaces(data.results);
  };
  console.log(currentPage);
  console.log(totalItems);

  return (
    <div className="w-full">
      <h1>Inspire Page</h1>
      <div id={'search'} className="flex flex-row justify-between w-full">
        <div><SearchBarForPlacesComponent selectedPlace={setCity} /></div>
        <div><RadiusForSearchComponent getRadius={setRadius} /></div>
        <button onClick={fetchPlaces} className="border-amber-400 border-4">Get ideas</button>
      </div>
      <div className="w-full">
        <PlaceFilterComponent placeCategories={categories} getCategoryValue={setFilterValue} />
      </div>
      <div className="flex">
        <Suspense fallback={(<div>Loading...</div>)}>
          <FilterPlaceList places={paginationPlaces} />
        </Suspense>
      </div>
      {
        totalItems > 6 && (
          <Pagination align="center"
                      onChange={handlePagination}
                      current={currentPage}
                      pageSize={6}
                      showSizeChanger={false}
                      total={totalItems} />
        )
      }
    </div>
  );
};
export default InspirePage;
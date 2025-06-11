'use client';

import { IPlaceForFilter } from '@/models/IPlaceForFilter';
import { FC, useEffect, useState } from 'react';
import { Dropdown, Typography } from 'antd';

interface IProps {
  placeCategories: IPlaceForFilter;
  getCategoryValue: (value: string) => void;
}

const PlaceFilterComponent: FC<IProps> = ({ placeCategories, getCategoryValue }) => {
  const [categoryValue, setCategoryValue] = useState<string>('');

  const handleCategorySelect = (key: string) => {
    setCategoryValue(key);
    getCategoryValue(key);
  };


  return (
    <div id="all shit" className="flex justify-between">
      {
        Object.entries(placeCategories).map(([category, items]) => (
          <Dropdown key={category}
            menu={{
              items: items.map((item) => ({
                key: item.key,
                label: <Typography.Text onClick={() => setCategoryValue(item.key)}>{item.name}</Typography.Text>,
              })),
              onClick: (e) => handleCategorySelect(e.key),
              selectable: true,
              selectedKeys: [categoryValue],
            }}
          >
            <Typography.Link className="hover:bg-pink-200" style={{ color: 'green' }}>
              {category}
            </Typography.Link>
          </Dropdown>
        ))
      }
    </div>
  );

};

export default PlaceFilterComponent;
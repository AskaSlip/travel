'use client';
import { FC, useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface IProps {
  getRadius: ((radius: number) => void);
}

const RadiusForSearchComponent: FC<IProps> = ({ getRadius }) => {
  const [radius, setRadius] = useState<number>(3);
  const handleChange = (value: number[]) => {
    const selectedRadius = value[0];
    setRadius(selectedRadius);
    getRadius(selectedRadius*1000);
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        Radius: {radius} km
      </label>
      <Slider max={25} step={1} value={[radius]} onValueChange={handleChange} />
    </div>
  );

};
export default RadiusForSearchComponent;
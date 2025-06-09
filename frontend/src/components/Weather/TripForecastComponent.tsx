"use client"
import { FC, useEffect, useState } from 'react';
import { ITripStop, ITripStopForecast } from '@/models/ITripStop';
import WeatherWidgetComponent from '@/components/Weather/WeatherWidgetComponent';
import styles from './WeatherWidget.module.css';
interface IProps {
  tripStops: ITripStop[];
  // setTripStops: (tripStops: ITripStop[]) => void;
}
//todo спитати в Іллі як вирішити проблема з однаковим містом
const TripForecastComponent : FC<IProps> = ({tripStops}) => {
  const [uniqueStops, setUniqueStops] = useState<ITripStopForecast[]>([]);

  useEffect(() => {
    const uniqueMap = new Map()
    tripStops.forEach(stop => {
      const key= `${stop.city}-${stop.country}`;
      if(!uniqueMap.has(key)){
        uniqueMap.set(key, {
          city: stop.city,
          country: stop.country,
          lat: stop.lat,
          lng: stop.lng,
        })
      }
    })
    const uniqueStopsMap = Array.from(uniqueMap.values())
    setUniqueStops(uniqueStopsMap)

  }, [tripStops]);


  return (
    <div className={styles.cityForecastWrapper}>
      {
        uniqueStops.map((stop, index) => (
          <WeatherWidgetComponent lat={stop.lat} lng={stop.lng} city={stop.city!} key={index}/>
        ))
      }
    </div>
  )
}
export default TripForecastComponent;
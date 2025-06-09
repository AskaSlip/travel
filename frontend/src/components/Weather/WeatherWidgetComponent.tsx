'use client';
import { FC, useEffect, useState } from 'react';
import { weatherService } from '@/services/third-party-api.service';
import DailyWeatherComponent from '@/components/Weather/DailyWeatherComponent';
import styles from './WeatherWidget.module.css';

interface IProps {
  lat: number;
  lng: number;
  city: string;
}


const WeatherWidgetComponent: FC<IProps> = ({ lat, lng, city }) => {
  const [forecast, setForecast] = useState<IWeatherWidget | null>(null);
  const [dailyForecast, setDailyForecast] = useState<IWeatherWidget[]>([]);
  const [openWeeklyForecast, setOpenWeeklyForecast] = useState<boolean>(false);


  useEffect(() => {
    const getForecast = async () => {
      try {
        const data = await weatherService.getForecast(lat, lng);
        const today = data.daily[0];
        const daily = data.daily.slice(0, 7).map((day: any) => ({
          dt: formatDate(day.dt),
          tempDay: day.temp.day,
          tempMin: day.temp.min,
          tempMax: day.temp.max,
          main: day.weather[0].main,
          description: day.weather[0].description,
          icon: day.weather[0].icon,
        }));
        setDailyForecast(daily);

        setForecast({
          dt: formatDate(today.dt),
          tempDay: today.temp.day,
          tempMin: today.temp.min,
          tempMax: today.temp.max,
          main: today.weather[0].main,
          description: today.weather[0].description,
          icon: today.weather[0].icon,
          summary: today.summary,
        });
      } catch (e) {
        console.error('Error fetching forecast:', e);
      }
    };

    getForecast();
  }, []);


  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };
  if (!forecast) return <div>Loading...</div>;

  const handleWeeklyForecast = () => {
    setOpenWeeklyForecast(!openWeeklyForecast);
  };

  return (
    <div>
      {forecast ? (
        <div>
          <div>
            <div>
              <h2>{city}</h2>
              <h2>{forecast.dt}</h2>
              <p>{forecast.main} – {forecast.description}</p>
              <p>Day: {Math.round(forecast.tempDay)}°C</p>
              <p>Min: {Math.round(forecast.tempMin)}°C</p>
              <p>Max: {Math.round(forecast.tempMax)}°C</p>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                alt={forecast.description}
              />
            </div>
            <button onClick={handleWeeklyForecast}>Weekly forecast</button>
          </div>
          {openWeeklyForecast ? (
            <div className={styles.dailyWidgetWrapper}>
              {
                dailyForecast.map((day, index) => (
                  <DailyWeatherComponent key={index} forecast={day} />
                ))
              }
            </div>
          ) : null
          }
        </div>
      ) : (
        <p>Weather is loading...</p>
      )}
    </div>
  );
};
export default WeatherWidgetComponent;
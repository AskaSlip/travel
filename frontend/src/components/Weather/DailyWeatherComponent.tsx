import { FC } from 'react';
import styles from './WeatherWidget.module.css';

interface IProps {
  forecast: IWeatherWidget;
}

const DailyWeatherComponent: FC<IProps> = ({ forecast }) => {
  return (
    <div className={styles.dailyWidget}>
      <h1>{forecast.dt}</h1>
      <img src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
           alt={forecast.description} />
      <p>Min: {Math.round(forecast.tempMin)}°C</p>
      <p>Max: {Math.round(forecast.tempMax)}°C</p>
    </div>
  );
};

export default DailyWeatherComponent;
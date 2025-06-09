interface IWeatherWidget {
  dt: number | string;
  tempDay: number;
  tempMin: number;
  tempMax: number;
  main: string;
  description: string;
  icon: string;
  summary: string;
}
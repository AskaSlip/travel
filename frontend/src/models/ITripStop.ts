export interface ITripStop {
  id?: string;
  key: string;
  notes?: string | '';
  city?: string;
  country?: string;
  iso_code?: string
  image?: string | '' | File;
  lat: number;
  lng: number;
}

export interface ITripStopUpdate{
  key: string,
  notes: string;
  image: string | File;
}

export interface ITripStopForecast extends Pick<ITripStop, 'country'| 'city' | 'iso_code' | 'lng' | 'lat'> {}
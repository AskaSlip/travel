export interface ITripStop {
  id: string;
  key: string;
  notes?: string | '';
  locality?: string;
  image?: string | '' | File;
  lat: number;
  lng: number;
}

export interface ITripStopUpdate{
  key: string,
  notes: string;
  image: string | File;
}
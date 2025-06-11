export interface IFilteredPlace {
  name: string;
  vicinity: string;
  rating: number;
  photos: IPhoto[];
}

export type IPhoto = {
  photo_reference: string;
}
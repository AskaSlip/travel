export interface IPlaceForFilter {
  [category: string]: IPlaceItem[]
}

export type IPlaceItem = {
  name: string;
  key: string;
}
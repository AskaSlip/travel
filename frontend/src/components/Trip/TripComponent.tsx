import { FC } from 'react';
import { ITrip } from '@/models/ITrip';

interface IProps {
  trip: ITrip;
}

const TripComponent: FC<IProps> = ({trip}) => {

  return (
    <div>
      <h1>{trip.trip_name}</h1>
      <p>{trip.description}</p>
      <p>{trip.date_of_trip}</p>
      <p>{trip.trip_picture}</p>
    </div>
  )
}

export default TripComponent;
import { FC } from 'react';
import { ITrip } from '@/models/ITrip';
import styles from './TripComponent.module.css';

interface IProps {
  trip: ITrip
}

const SimpleTripComponent: FC<IProps> = ({trip}) => {
  return (
    <div>
      <h1>{trip.trip_name}</h1>
      <h2>{trip.id}</h2>
      <h5>{trip.description}</h5>
      <h5>{trip.date_of_trip}</h5>
      <img src={trip.trip_picture || '/defaultTripPic.jpg'} alt={'picture of trip'} className={styles.tripImage}/>
    </div>
  );
}
export default SimpleTripComponent;
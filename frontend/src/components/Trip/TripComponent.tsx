"use client";
import { FC } from 'react';
import { ITrip } from '@/models/ITrip';

interface IProps {
  trip: ITrip;
}

const TripComponent: FC<IProps> = ({trip}) => {


  return (
    <div>
      <h1>{trip.trip_name}</h1>
      <p>{trip?.id}</p>
      <p>{trip.description}</p>
      <p>{trip.date_of_trip ? new Date(trip.date_of_trip).toLocaleDateString() :  null}</p>      <p>{trip.trip_picture}</p>
      {/*<span>*/}
      {/*  {trip.tripStops?.map((stop) => (*/}
      {/*    <div key={stop.id} className={styles.stops}>*/}
      {/*      <h2>{stop.key}</h2>*/}
      {/*      <p>{stop.notes}</p>*/}
      {/*      <h2>{stop.lat}{stop.lng}</h2>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</span>*/}
    </div>
  )
}

export default TripComponent;
"use client"
import { ITrip } from '@/models/ITrip';
import { FC, useEffect, useState } from 'react';
import { tripService } from '@/services/api.services';
import TripComponent from '@/components/Trip/TripComponent';
import styles from './TripsComponent.module.css';
import Link from 'next/link';


const TripsComponent = () => {

  const [trip, setTrip] = useState<ITrip[]>([]);

  useEffect(() => {
    tripService.getUserTrips()
      .then((data) => {
        console.log("Fetched trips:", data);
        setTrip(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching trips:", err);
        setTrip([]);
      });
  }, []);

  if (trip === null) return <h1>Loading...</h1>;

  return (
    <div>
      {trip.length > 0 ? (
        trip.map((trip: ITrip) => (
            <div key={trip.id}  className={styles.boxWrap}>
              <Link href={`/trips/${trip.id}`}>
                <TripComponent trip={trip}/>
              </Link>
            </div>
          ))
      ): <h1>no trips</h1>}
    </div>
  )
}

export default TripsComponent;
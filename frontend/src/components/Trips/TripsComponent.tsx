"use client"
import { ITrip } from '@/models/ITrip';
import { FC, useEffect, useState } from 'react';
import { tripService } from '@/services/api.services';
import styles from './TripsComponent.module.css';
import Link from 'next/link';
import SimpleTripComponent from '@/components/Trip/SimpleTripComponent';


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
                <SimpleTripComponent trip={trip}/>
              </Link>
            </div>
          ))
      ): (
        <div>
          <h1>You don't have any trip, so let's create one</h1>
          <Link href="/create-trip">
            <button>Create Your First Trip</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default TripsComponent;
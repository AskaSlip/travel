import React from 'react';
import CreateTripComponent from '@/components/CreateTrip/CreateTripComponent';
import TripsComponent from '@/components/Trips/TripsComponent';

const TripsPage = () => {

    return (
        <div>
            <h1>all my trips</h1>
          <TripsComponent/>

        </div>
    );
};

export default TripsPage;
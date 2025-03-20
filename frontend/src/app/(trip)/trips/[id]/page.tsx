"use client"
import React from 'react';
import CreateTripComponent from '@/components/CreateTrip/CreateTripComponent';
import { useParams } from 'next/navigation';

const TripByIdPage = () => {

  const { id } = useParams()
  

    return (
        <div>
            <h1>trip {id}</h1>

        </div>
    );
};

export default TripByIdPage;
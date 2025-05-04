'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MapComponent from '@/components/Maps/MapComponent';
import { ITrip } from '@/models/ITrip';
import { tripService, tripStopService } from '@/services/api.services';
import TripComponent from '@/components/Trip/TripComponent';
import TripStopsComponent from '@/components/TripStopsComponent/TripStopsComponent';
import styles from './id-style.module.css';
import { ITripStop, ITripStopUpdate } from '@/models/ITripStop';
import PoiMarkers from '@/components/Maps/PoiMarkers';
import { APIProvider } from '@vis.gl/react-google-maps';

const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

const googleMapsLibraries: ('geometry' | 'places' | 'drawing' | 'visualization')[] = ['places'];
//todo зробити календар

const TripByIdPage = () => {

  const { id } = useParams() as { id: string };
  const [trip, setTrip] = useState<ITrip>();
  const [tripStops, setTripStops] = useState<ITripStop[]>(trip?.tripStops ?? []);
  const [selectedMarker, setSelectedMarker] = useState<ITripStop | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripData = await tripService.getTripById(id);
        setTrip(tripData);
      } catch (err) {
        console.error('Failed to fetch trip:', err);
      }
    };

    const fetchStops = async () => {
      try {
        const stops = (await tripService.getTripStops(id)).map((stop) => ({
          ...stop,
          lat: Number(stop.lat),
          lng: Number(stop.lng),
        }));
        setTripStops(stops);
      } catch (err) {
        console.error('Failed to fetch stops:', err);
      }
    };

    fetchTrip();
    fetchStops();
  }, [id]);
  console.log('stooop from set', tripStops);

  // const handleOpenCreateModal = (newMarker: ITripStop) => {
  //   setSelectedMarker(newMarker);
  //   setMode('create');
  //   setIsModalOpen(true);
  // };
  //
  // const handleOpenEditModal = (marker: ITripStop) => {
  //   setSelectedMarker(marker);
  //   setMode('edit');
  //   setIsModalOpen(true);
  // };

  const handleUpdate = async (
    data: {
      key?: string;
      notes?: string | null;
      image?: File | string | null;
    },
  ) => {
    if (!selectedMarker || !data.key) return;

    let imageUrl = typeof data.image === 'string' ? data.image : '';
    if (data.image instanceof File) {
      const uploadedImage = await tripStopService.uploadImage(data.image, selectedMarker.id);
      imageUrl = uploadedImage.image;
    }

    const fixed: ITripStopUpdate = {
      key: data.key,
      notes: data.notes ?? '',
      image: imageUrl,
    };

    try {
      setHasChanges(true);
      await tripStopService.updateTripStop(selectedMarker.id, fixed);

      setTripStops((prev) =>
        prev.map((poi) =>
          poi.id === selectedMarker.id ? { ...poi, ...fixed } : poi,
        ),
      );

      setIsModalOpen(false);
      setSelectedMarker(null);

    } catch (error) {
      console.error('Error updating trip stop:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tripStopService.deleteTripStop(id);

      setTripStops(prev => prev.filter(poi => poi.id !== id));

      setSelectedMarker((prev) => (prev?.id === id ? null : prev));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting trip stop:', error);
    } finally {
      setHasChanges(false);
    }
  };


  if (!trip) return null;

  return (
    <div className={styles.wrap}>
      <APIProvider apiKey={key}
                   onLoad={() => console.log('Maps API has loaded.')}
                   libraries={googleMapsLibraries}
      >
      <div className={styles.wrap}>
        <div>
          <TripComponent trip={trip} />
          <hr />
          <MapComponent tripId={id} setTripStops={setTripStops} tripStops={tripStops}>
            <PoiMarkers
              pois={tripStops}
              handleUpdateAction={handleUpdate}
              handleDeleteAction={handleDelete}
              selectedMarker={selectedMarker}
              setSelectedMarker={setSelectedMarker}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen} />
          </MapComponent>
        </div>
        <div>
          <TripStopsComponent
            tripStops={tripStops}
            onEditAction={handleUpdate}
            onDeleteAction={handleDelete}
            selectedStop={selectedMarker}
            setSelectedStop={setSelectedMarker}
          />
        </div>
      </div>
        <div>
          <span>ticket box</span>
        </div>
      </APIProvider>
    </div>
  );
};


export default TripByIdPage;
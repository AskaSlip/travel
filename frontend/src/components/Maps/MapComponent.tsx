'use client';
import {
  AdvancedMarker,
  Map,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { FC, useEffect, useState } from 'react';
import { IUserMarker } from '@/models/IUserMarker';
import SearchBox from '@/components/Maps/SearchBox';
import PinModal from '@/modals/PinModal';
import { tripStopService } from '@/services/api.services';
import { ITripStop } from '@/models/ITripStop';
import styles from './MapComponent.module.css';
import DirectionCreator from '@/components/Maps/DirectionCreator';

interface IProps {
  children?: React.ReactNode;
  tripId: string;
  tripStops?: ITripStop[];
  setTripStops?: (tripStops: ITripStop[] | ((prev: ITripStop[]) => ITripStop[])) => void;}

const textAreas = {
  title: 'Create a new stop to your trip',
  description: 'Add some notes about your stop',
  saveBtn: 'Save',
  deleteBtn: 'Delete',
};

const map_id = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string;

const MapComponent: FC<IProps> = ({ tripId, children, tripStops, setTripStops }) => {

  const [isClient, setIsClient] = useState<boolean>(false);
  const [userMarker, setUserMarker] = useState<IUserMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<IUserMarker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  //check for file
  const isFile = (value: unknown): value is File => {
    return typeof File !== 'undefined' && value instanceof File;
  };

  useEffect(() => {
    setIsClient(true);
  }, []);


  const getLocality = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise<{ city: string; country: string; iso_code:string; name: string }>((resolve, reject) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          const addressComponents = results[0]?.address_components || [];
          // console.log(JSON.stringify(results, null, 2));

          const cityComponent = addressComponents.find(c =>
            c.types.includes('locality') || c.types.includes('postal_town')
          );
          const countryComponent = addressComponents.find(c =>
            c.types.includes('country')
          );

          const city = cityComponent?.long_name || 'unknown';
          const country = countryComponent?.long_name || 'unknown';
          const iso_code = countryComponent?.short_name || 'unknown';
          const name = results[0]?.formatted_address || 'unknown';

          resolve({ city, country,iso_code, name });
        } else {
          reject('no info about city/country');
        }
      });
    });
  };

  const onMapClick = async (ev: MapMouseEvent) => {
    const latLng = ev.detail.latLng;
    if (latLng) {
      try {
        const { city, country, iso_code, name } = await getLocality(latLng);
        const newMarker = { lat: latLng.lat, lng: latLng.lng, name, city, country, iso_code };
        setUserMarker((prev) => [...prev, newMarker]);
        setSelectedMarker(newMarker);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Помилка при отриманні locality and name:', error);
      }
    }
  };

  console.log('selected', selectedMarker);
  console.log(userMarker, 'userMarker');

  const handleMarkerClick = (marker: IUserMarker) => {
    console.log('Клік на маркер', marker);
    setSelectedMarker(marker);
    setIsModalOpen(true);
  };

  const handleSave = async (data:
                        | { key: string; image?: string | null; notes?: string | null }
                        | { image?: string | null; key?: string; notes?: string | null }
  ) => { if (!selectedMarker || !data.key) return;

try{
    const newStop = await tripStopService.createTripStop(tripId, {
      key: data.key,
      notes: data.notes ?? '',
      image: '',
      lat: selectedMarker.lat,
      lng: selectedMarker.lng,
      city: selectedMarker.city,
      country: selectedMarker.country,
      iso_code: selectedMarker.iso_code,

    })


  if (isFile(data.image)) {
    const updatedStop = await tripStopService.uploadImage(data.image, newStop.id!);
    newStop.image = updatedStop.image;
  }

      const newPoi: ITripStop = {
        id: newStop.id,
        key: newStop.key,
        lat: Number(newStop.lat),
        lng: Number(newStop.lng),
        image: newStop.image,
        city: newStop.city,
        iso_code: newStop.iso_code,

      };

  setUserMarker((current) =>
    current.filter(
      (m) => m.lat !== selectedMarker.lat || m.lng !== selectedMarker.lng,
    )
  );

      if (setTripStops) {
        setTripStops((prev) => [...(prev || []), newPoi]);
      }

      setSelectedMarker(null);
      setIsModalOpen(false);
      console.log('Saved:', data);
    }catch (error) {
  console.error('Error while saving', error);
}
  };

  const handleMarkerDelete = () => {
    if (!selectedMarker) return;
    setUserMarker((current) =>
      current.filter(
        (m) => m.lat !== selectedMarker.lat || m.lng !== selectedMarker.lng,
      ),
    );
    setIsModalOpen(false);
  };

  const center = tripStops?.[0]
    ? { lat: tripStops[0].lat, lng: tripStops[0].lng }
    : { lat: 49.839683, lng: 24.029717 };

  if (!isClient) {
    return null;
  }

  return (
<div className={styles.wrap}>
      <h1>Map</h1>
      <div style={{ width: '100%', height: '100%' }}>
        <Map
          style={{ width: '800px', height: '500px' }}
          defaultZoom={13}
          defaultCenter={center}
          mapId={map_id}
          onClick={onMapClick}

        >
          <SearchBox
            onPlaceSelect={(latLng, name, city, country) => {
              const newMarker = { lat: latLng.lat, lng: latLng.lng, name, city, country };
              setUserMarker((prev) => [...prev, newMarker]);
              setSelectedMarker(newMarker);
              setIsModalOpen(true);
              console.log(newMarker);
            }}
          />
          {children}
          {userMarker.map((marker: IUserMarker, index: number) => (
            <AdvancedMarker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}
          {tripStops && <DirectionCreator tripStops={tripStops}/>}
        </Map>
        <PinModal onSaveAction={handleSave}
                  onDeleteAction={handleMarkerDelete}
                  open={isModalOpen}
                  onOpenChangeAction={setIsModalOpen}
                  textAreas={textAreas}
                  mode="create"
        />

      </div>
</div>
  );
};

export default MapComponent;
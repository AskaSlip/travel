import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';
import { ITripStop } from '@/models/ITripStop';
import PinModal from '@/components/Maps/PinModal';
import { TripStopUpdateFormData } from '@/validator/validation';

// const getLocality = (latLng: google.maps.LatLngLiteral) => {
//   const geocoder = new window.google.maps.Geocoder();
//   return new Promise<string>((resolve, reject) => {
//     geocoder.geocode({ location: latLng }, (results, status) => {
//       if (status === google.maps.GeocoderStatus.OK && results) {
//         const localityResult = results.find(result =>
//           result.types.includes('locality')
//         );
//         const locality = localityResult ? localityResult.address_components[0].long_name : 'unknown';
//         resolve(locality);
//       } else {
//         reject('no info about locality');
//       }
//     });
//   });
// };

const textAreas = {
  title: 'Modify your trip stop',
  description: 'Change or delete your stop',
  saveBtn: 'Update',
  deleteBtn: 'Delete',
};

interface IProps {
  pois: ITripStop[];
  handleUpdateAction: (data: TripStopUpdateFormData) => void;
  handleDeleteAction: (id: string) => void;
  selectedMarker: ITripStop | null;
  setSelectedMarker: (marker: ITripStop | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;

}

const PoiMarkers: FC <IProps> = ({pois, handleUpdateAction, handleDeleteAction, selectedMarker, setSelectedMarker, isModalOpen, setIsModalOpen}) => {

  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);


  const handleMarkerClick = useCallback((poi: ITripStop) => (ev: google.maps.MapMouseEvent) => {
    if (!map || !ev.latLng) return;

    console.log('Clicked marker ID:', poi.id);
    console.log('Coordinates:', ev.latLng.lat(), ev.latLng.lng());

    setSelectedMarker(poi);
    setIsModalOpen(true);
    map.panTo(ev.latLng);
  }, [map, setSelectedMarker, setIsModalOpen]);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);


  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

//todo досі не вирішили чи треба мені локаліті, але скоріше за все, шо ні
  // useEffect(() => {
  //   const fetchLocalities = async () => {
  //     const poisWithLocality = await Promise.all(
  //       pois.map(async (poi) => {
  //         try {
  //           const locality = await getLocality(poi.location);
  //           return { ...poi, locality };
  //         } catch (error) {
  //           console.error("Error fetching locality:", error);
  //           return { ...poi, locality: 'unknown' };
  //         }
  //       })
  //     );
  //     setPoisWithLocality(poisWithLocality);
  //   };
  //
  //   fetchLocalities();
  // }, [pois]);

//todo зробити якось відображення інфи про маркер (в ідеалі подивитись на infoWindow в @vis.gl/react-google-maps)
  return (
    <div>
      {pois.map( (poi: ITripStop) => (
        <AdvancedMarker
          key={poi.key}
          position={{lat: poi.lat, lng: poi.lng }}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleMarkerClick(poi)}
          >
          <Pin background={'rgba(127,61,217,0.14)'} glyphColor={'rgba(0,0,0,0)'} borderColor={'rgba(0,0,0,0)'} />
        </AdvancedMarker>
      ))}


      {selectedMarker && (
        <PinModal
          onSaveAction={handleUpdateAction}
          onDeleteAction={() => selectedMarker && handleDeleteAction(selectedMarker.id)}
          open={isModalOpen}
          onOpenChangeAction={setIsModalOpen}
          textAreas={textAreas}
          mode='edit'
          initialData={{
            key: selectedMarker.key,
            notes: selectedMarker.notes ?? '',
            image: selectedMarker.image ?? '',
          }
        }
        />
      )}
    </div>
  );
}

export default PoiMarkers;
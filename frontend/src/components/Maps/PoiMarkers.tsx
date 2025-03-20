import { AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { IPoi } from '@/models/IPoi';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusterer';

interface IProps {
  pois: IPoi[];
}

const PoiMarkers: FC <IProps> = ({pois}) => {

  const map = useMap();
  //маркери це ті, які знаходяться в масиві
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  const handleClick = useCallback((ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked:', ev.latLng.toString());
    map.panTo(ev.latLng);
  }, []);


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

  return (
    <div>
      {pois.map( (poi: IPoi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={handleClick}
          >
          <Pin background={'#7f3dd9'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}

    </div>
  );
}

export default PoiMarkers;
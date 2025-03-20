"use client"
import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent, MapMouseEvent } from '@vis.gl/react-google-maps';
import PoiMarkers from '@/components/Maps/PoiMarkers';
import { useEffect, useRef, useState } from 'react';
import { IUserMarker } from '@/models/IUserMarker';
import SearchBox from '@/components/Maps/SearchBox';

const googleMapsLibraries: ('geometry' | 'places' | 'drawing' | 'visualization')[] = ['places'];
type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  // {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
  // {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
  // {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
  // {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
  // {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
  // {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
  // {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
  // {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
  // {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
  // {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
  // {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
  // {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
  // {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
  // {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
  // {key: 'barangaroo', location: { lat: -33.8605523, lng: 151.1972205 }},
];

const MapComponent = () => {

  const [isClient, setIsClient] = useState(false);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();
  const [address, setAddress] = useState<string>("");
  const [pois, setPois] = useState<Poi[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
  const map_id = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID as string;


  const [userMarker, setUserMarker] = useState<IUserMarker[]>([]);

  const onMapClick = (ev: MapMouseEvent) => {
    const latLng = ev.detail.latLng

    if (latLng) {
      setUserMarker((current: any) => [
        ...current,
        {
          lat: latLng.lat,
          lng: latLng.lng
        }
      ]);
      console.log(latLng);

    }else {
      console.error('No latLng found in event');
    }

  };

  console.log(userMarker);

  const handleMarkerClickDelete = (index: number) => {
    setUserMarker((current: any) => current.filter((_: any, i: number) => i !== index));
  };

  //test area ---------------

//todo зробити це після беку
//   useEffect(() => {
//     if (latitude && longitude && address) {
//       setPois(
//         { key: address, location: { lat: latitude, lng: longitude } }
//       );
//     }
//   }, [latitude, longitude, address]);


//-----------------------
  if (!isClient) {
    return null;
  }

    return (

          <APIProvider
            apiKey={key}
            onLoad={() => console.log('Maps API has loaded.')}
            libraries={googleMapsLibraries}
          >
          <h1>Map</h1>
            <div style={{ width: "100%", height: "500px" }}>
              <Map
                style={{ width: "800px", height: "500px" }}
                defaultZoom={13}
                defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                mapId={map_id}
                onClick={onMapClick}
                >
                <SearchBox setAddress={setAddress} address={address} setLatitude={setLatitude} setLongitude={setLongitude} latitude={latitude ?? 0} longitude={longitude ?? 0}/>
                <PoiMarkers pois={pois} />
                {userMarker.map((marker:any, index: number) => (
                  <AdvancedMarker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => handleMarkerClickDelete(index)}
                  />
                ))}
              </Map>
              <div>
                <span>Address: {address}</span>
                <span>LAt: {latitude}</span>
                <span>Lng: {longitude}</span>
              </div>
            </div>
          </APIProvider>

    )
}

export default MapComponent;
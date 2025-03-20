"use client"
import dynamic from 'next/dynamic';

const Direction = dynamic(() => import("@/components/Maps/Direction"), { ssr: false });


export default function RequestPage (){
  //
  // // const containerStyle = {
  // //   width: '600px',
  // //   height: '400px',
  // // }
  // //
  // // const center = {
  // //   lat: -3.745,
  // //   lng: -38.523,
  // // }
  // //
  // // const { isLoaded } = useJsApiLoader({
  // //   id: 'google-map-script',
  // //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  // // })
  // //
  // // const [map, setMap] = React.useState(null)
  // //
  // // const onLoad = React.useCallback(function callback(map:any) {
  // //   const bounds = new window.google.maps.LatLngBounds(center)
  // //   map.fitBounds(bounds)
  // //
  // //   setMap(map)
  // // }, [])
  // //
  // // const onUnmount = React.useCallback(function callback(map:any) {
  // //   setMap(null)
  // // }, [])
  // //
  // // return isLoaded ? (
  // //   <GoogleMap
  // //     mapContainerStyle={containerStyle}
  // //     center={center}
  // //     zoom={13}
  // //     onLoad={onLoad}
  // //     onUnmount={onUnmount}
  // //   >
  // //     {/* Child components, such as markers, info windows, etc. */}
  // //     <></>
  // //   </GoogleMap>
  // // ) :
  // //   (
  // //   <></>
  // // )
  // const [form, setForm] = useState({
  //   name: "",
  //   address: "",
  //   latitude: null,
  //   longitude: null,
  //   radius: 500,
  // });
  //
  // const [latitude, setLatitude] = useState(24.799448);
  // const [longitude, setLongitude] = useState(54.979021);
  // const [address, setAddress] = useState("");
  //
  //
  //
  // return (
  //   <div className="w-full h-screen flex items-center justify-center">
  //     <h1>Request Page</h1>
  //     <GoogleMaps address={address} setAddress={setAddress} radius={form.radius} latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude}  />
  //
  //     <div>
  //       <span>Address: {address}</span>
  //       <span>LAt: {latitude}</span>
  //       <span>Lng: {longitude}</span>
  //     </div>
  //   </div>
  // )

  return (
    <div>
      <h1>Request Page</h1>
      <Direction />
    </div>
  )

}

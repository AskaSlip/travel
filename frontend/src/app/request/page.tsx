"use client"
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import React from 'react'

export default function RequestPage (){

  const containerStyle = {
    width: '400px',
    height: '400px',
  }

  const center = {
    lat: -3.745,
    lng: -38.523,
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyApSm_qxTWDTjFK8XLl_toiWUIU0KQ9tcM",
    //todo fix env
    // googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map:any) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map:any) {
    setMap(null)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  )
}

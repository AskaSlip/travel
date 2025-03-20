"use client"
import dynamic from 'next/dynamic';
import { useState } from 'react';
import GoogleMaps from '@/components/Maps/fromVideo';

export default function Request1Page (){

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    radius: 500,
  });

  const [latitude, setLatitude] = useState(24.799448);
  const [longitude, setLongitude] = useState(54.979021);
  const [address, setAddress] = useState("");



  return (
    <div className="w-full h-[900px] flex flex-col">
      <h1>Request Page</h1>
      <div className="w-full h-full">
      <GoogleMaps address={address} setAddress={setAddress} radius={form.radius} latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude}  />
      </div>
      <div>
        <span>Address: {address}</span>
        <span>LAt: {latitude}</span>
        <span>Lng: {longitude}</span>
      </div>
    </div>
  )


}

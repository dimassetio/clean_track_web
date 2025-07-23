'use client';
import React, { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

interface MapPickerProps {
  lat: number;
  lng: number;
  onSelect: (lat: number, lng: number) => void;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const LIBRARIES: ("marker")[] = ['marker'];

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const position = new google.maps.LatLng(lat, lng);

    if (markerRef.current) {
      markerRef.current.position = position;
    } else {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position,
        title: 'Selected Location',

      });

      markerRef.current = marker;
    }

    // Pan the map to the marker
    mapRef.current.panTo(position);
  }, [lat, lng, isLoaded]);

  const handleClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onSelect(e.latLng.lat(), e.latLng.lng());
    }
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={13}
      onClick={handleClick}
      onLoad={(map) => void (mapRef.current = map)}
      options={{
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      }}
    />
  );
};

export default MapPicker;

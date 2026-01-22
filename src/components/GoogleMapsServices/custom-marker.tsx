import type {Marker} from '@googlemaps/markerclusterer';
import {useCallback, useState} from 'react';
import {AdvancedMarker, InfoWindow} from '@vis.gl/react-google-maps';
import { ServiceLocation } from './type';
import CustomMapMarker from '../MapIcon';

export type CustomMarkerProps = {
  location: ServiceLocation;
  onClick: (location: ServiceLocation) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const CustomMarker = (props: CustomMarkerProps) => {
  const {location, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => {
    onClick(location);
  }, [onClick, location]);
  
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, location.id.toString()),
    [setMarkerRef, location.id]
  );


  return (
    <AdvancedMarker 
      position={{ lat: location.latitude, lng: location.longitude }} 
      ref={ref} 
      onClick={handleClick}
      className="transition-all duration-300 cursor-pointer hover:scale-110" 
    >
      <div className="relative group">
        <CustomMapMarker type={"LOGO"} />
      </div>
      
    </AdvancedMarker>
  );
};
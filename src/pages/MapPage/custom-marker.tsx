import type {Marker} from '@googlemaps/markerclusterer';
import {useCallback} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';
import { ServiceLocation } from './type';
import CustomMapMarker from '../../components/MapIcon';

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

  const handleClick = useCallback(() => onClick(location), [onClick, location]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, location.id.toString()),
    [setMarkerRef, location.id]
  );

  const getMarkerContent = (location: ServiceLocation) => {
    return <CustomMapMarker type={location.type} state={location.state} />;
  };

  return (
    <AdvancedMarker position={{ lat: location.latitude, lng: location.longitude }} ref={ref} onClick={handleClick}>
        {getMarkerContent(location)}
    </AdvancedMarker>
  );
};
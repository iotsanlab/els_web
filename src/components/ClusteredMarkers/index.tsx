import { useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer, GridAlgorithm } from "@googlemaps/markerclusterer";
import { ServiceLocation } from "../../utils/map";
import { CustomMarker } from "../CustomMarker";

export type ClusteredMarkersProps = { 
  locations: ServiceLocation[];
  onMarkerClick: (id: number, visible?: boolean, type?: string, serviceId?: number) => void;
};

/**
 * The ClusteredMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredMarkers = ({
  locations,
  onMarkerClick,
}: ClusteredMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  // eslint-disable-next-line no-unused-vars
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const map = useMap();
  
  // Create clusterer using useMemo to ensure proper reactivity
  const clusterer = useMemo(() => {
    if (!map) return null;
    
    try {
      const algorithm = new GridAlgorithm({
        maxZoom: 15,
        gridSize: 30
      });
      
      return new MarkerClusterer({ map, algorithm });
    } catch (error) {
      console.error("Error creating clusterer:", error);
      return null;
    }
  }, [map]);

  // Sadece marker ekleme/silme gibi yapısal değişikliklerde marker'ları sıfırla
  // State değişikliklerinde (marker rengi vs.) sıfırlama yapma
  const locationIds = useMemo(() => 
    locations.map(loc => loc.id).sort().join(','), 
    [locations]
  );

  // Reset markers when location structure changes (add/remove)
  useEffect(() => {
    if (!clusterer) return;
    
    // Clear all existing markers when locations structure change
    try {
      clusterer.clearMarkers();
    } catch (error) {
      console.error("Error clearing markers:", error);
    }
    
    // Reset markers state if locations is empty
    if (locations.length === 0) {
      setMarkers({});
    }
  }, [locationIds, clusterer]);

  // Add markers to clusterer when they change
  useEffect(() => {
    if (!clusterer || !map) return;
    
    const markerArray = Object.values(markers);
    if (markerArray.length === 0) return;
    
    // Check if map is loaded enough to add markers
    const tryAddMarkers = () => {
      try {
        clusterer.clearMarkers();
        clusterer.addMarkers(markerArray);
        return true;
      } catch (error) {
        console.error("Error adding markers, will retry:", error);
        return false;
      }
    };
    
    // Try immediately if projection exists
    if (map.getProjection() && tryAddMarkers()) {
      return;
    }
    
    // Otherwise wait for idle event
    const idleListener = map.addListener('idle', () => {
      if (tryAddMarkers()) {
        google.maps.event.removeListener(idleListener);
      }
    });
    
    // Also try after a timeout as last resort
    const timeoutId = setTimeout(() => {
      tryAddMarkers();
      google.maps.event.removeListener(idleListener);
    }, 1000);
    
    return () => {
      google.maps.event.removeListener(idleListener);
      clearTimeout(timeoutId);
    };
  }, [clusterer, markers, map]);

  const handleMarkerClick = useCallback((location: ServiceLocation) => {
    setSelectedLocationId(location.id.toString());
    onMarkerClick(location.id, location.visible, location.type, location.serviceId);
  }, [onMarkerClick]);

  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: unused, ...newMarkers } = markers;
        return newMarkers;
      }
    });
  }, []);

  

  return (
    <>
      {locations.map((location) => (
        <CustomMarker
          key={location.id}
          location={location}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </>
  );
};

import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GridAlgorithm, type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { ServiceLocation } from "./type";
import { CustomMarker } from "./custom-marker";

export type ClusteredLocationMarkersProps = {
  locations: ServiceLocation[];
  onMarkerClick: (id: number, visible?: boolean) => void;
};

/**
 * The ClusteredTreeMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredLocationMarkers = ({
  locations,
  onMarkerClick,
}: ClusteredLocationMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );
  const [showInfo, setShowInfo] = useState(false);

  const selectedLocation = useMemo(
    () =>
      locations && selectedLocationId
        ? locations.find((t) => t.id.toString() === selectedLocationId)!
        : null,
    [locations, selectedLocationId]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer || !map) return;

    if (locations.length > 0) {
      try {
        clusterer.clearMarkers();
        clusterer.addMarkers(Object.values(markers));
      } catch (error) {
        console.error("Error updating clusterer:", error);
      }
    }
  }, [clusterer, markers, map]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocationId(null);
    setShowInfo(false);
  }, []);

  const handleMarkerClick = useCallback((location: ServiceLocation) => {
    // Önce mevcut InfoWindow'u kapat, sonra yenisini aç
    // Bu, bir InfoWindow açıkken diğerini açmaya çalıştığımızda oluşan crash'i önler
    setShowInfo(false);
    
    // Kısa bir gecikme ile yeni InfoWindow'u aç
    setTimeout(() => {
      setSelectedLocationId(location.id.toString());
      setShowInfo(true);
      onMarkerClick(location.id);
    }, 10);
  }, [onMarkerClick]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoClose = useCallback(() => {
    setShowInfo(false);
    setSelectedLocationId(null);
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

      {selectedLocation && showInfo && (
        <InfoWindow
          anchor={markers[selectedLocationId ?? '']}
          onCloseClick={handleInfoClose}
          className='bg-white p-2 rounded-[10px] shadow-lg'
        >
          <span className="text-sm font-medium">{selectedLocation.name}</span>
        </InfoWindow>
      )}
    </>
  );
};

import React, { useState, useEffect, useMemo } from "react";
 
import {
  AdvancedMarker,
  APIProvider,
  Map,  
} from "@vis.gl/react-google-maps";

import vitaminCStyles from "./map-styles/gray";
import { MAP_IDS, ServiceLocation } from "./type";
import { ClusteredLocationMarkers } from "./cluster";
import ServiceItem from "../ServiceItem";
const MapTypeId = {
  HYBRID: "hybrid",
  ROADMAP: "roadmap",
  SATELLITE: "satellite",
  TERRAIN: "terrain",
};

export type MapConfig = {
  id: string;
  label: string;
  mapId?: string;
  mapTypeId?: string;
  styles?: google.maps.MapTypeStyle[];
};

const MAP_CONFIGS: MapConfig[] = [
  {
    id: "styled2",
    label: 'Raster / "Vitamin C" (no mapId)',
    mapTypeId: MapTypeId.ROADMAP,
    styles: vitaminCStyles,
  },
];

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapsServiceProps {
  serviceLocations: ServiceLocation[];
}

const GoogleMapsService = ({ serviceLocations }: GoogleMapsServiceProps) => {
  const [mapConfig, setMapConfig] = useState<MapConfig>(MAP_CONFIGS[0]);

  const center = useMemo(() => {
    if (serviceLocations.length === 0) {
      return { lat: 39.9334, lng: 32.8597 }; // Varsayılan merkez (Ankara)
    }

    const lats = serviceLocations
      .map((m) => m.latitude)
      .filter((lat) => lat !== 0);
    const lngs = serviceLocations
      .map((m) => m.longitude)
      .filter((lng) => lng !== 0);

    if (lats.length === 0 || lngs.length === 0) {
      return { lat: 39.9334, lng: 32.8597 }; // Varsayılan merkez (Ankara)
    }

    return {
      lat: (Math.min(...lats) + Math.max(...lats)) / 2,
      lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
    };
  }, [serviceLocations]);


  return (
    <div className="w-full h-full p-1   rounded-[10px]">
      <div className="w-full h-[450px] bg-white dark:bg-gray10 p-1 rounded-[10px] custom-shadow">
        <APIProvider apiKey={API_KEY} >
          <Map
            id={mapConfig.id}
            defaultCenter={center}
            defaultZoom={2}
            mapId={MAP_IDS[4]}
            mapTypeId={mapConfig.mapTypeId}
            styles={mapConfig.styles}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            keyboardShortcuts={false}
          >
            <ClusteredLocationMarkers locations={serviceLocations}   onMarkerClick={(id: number, visible: boolean | undefined) => {}}/>
          </Map>
        </APIProvider>
        </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        {
          serviceLocations.map((service) => (
            <ServiceItem 
              key={service.id} 
              id={service.id} 
              name={service.name} 
              region={service.region || ''} 
              city={service.city} 
              address={service.address} 
              lat={service.latitude} 
              long={service.longitude}
              phone={service.phone} 
              mail={service.mail} 
              web={service.web}
              isImage={false}
            />
          ))
        }
      </div>
    </div>
  );
};

export default GoogleMapsService;

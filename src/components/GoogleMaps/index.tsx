import { APIProvider, ControlPosition, Map } from "@vis.gl/react-google-maps";
import { useMemo, useState, useEffect } from "react";
import { ServiceLocation, MAP_IDS } from "../../utils/map";
import { CustomZoomControl } from "../MapControl";
import { useDarkMode } from "../../context/DarkModeContext";
import { ClusteredMarkers } from "../ClusteredMarkers";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
interface GoogleMapsProps {
  serviceLocations: ServiceLocation[];
  className?: string;
  onMarkerClick?: (id: number) => void;
  onClick?: () => void;
  extraZoom?: number;
}

// SetupMapControls bileşeni - harita tiplerini dropdown olarak gösterir
const SetupMapControls = () => {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib) return;

    map.setOptions({
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: window.google.maps.ControlPosition.TOP_LEFT,
        mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain"],
      },
    });
  }, [map, mapsLib]);

  return null;
};

const GoogleMaps = ({ serviceLocations, className, onMarkerClick, onClick, extraZoom }: GoogleMapsProps) => {


  const { isDarkMode } = useDarkMode();
  const [zoom, setZoom] = useState(extraZoom ? extraZoom : 6);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  

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

  const handleMarkerClick = (id: number, visible: boolean | undefined) => {
  if (visible && onMarkerClick) {
    onMarkerClick(id);
  }
};

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        id="map"
        style={{ width: "auto", height: "100%" }}
        defaultCenter={center}
        zoom={zoom}
        keyboardShortcuts={false}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        clickableIcons={false}
        mapId={isDarkMode ? MAP_IDS[3] : MAP_IDS[0]}
        onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
        className={className}
        onClick={onClick}
      >
        <SetupMapControls />
        <ClusteredMarkers
          locations={serviceLocations}
          onMarkerClick={(id: number, visible: boolean | undefined) =>
            handleMarkerClick(id, visible)
          }
        />

        <CustomZoomControl
          controlPosition={ControlPosition.INLINE_END_BLOCK_END}
          zoom={zoom}
          onZoomChange={setZoom}
          isEditActive={false}
        />
      </Map>
    </APIProvider>
  );
};

export default GoogleMaps;

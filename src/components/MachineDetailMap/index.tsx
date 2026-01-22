import { Map } from "leaflet";
import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { SvgIcons } from "../../assets/icons/SvgIcons";
import L from 'leaflet';
import CustomMapMarker from "../MapIcon";
import ReactDOMServer from 'react-dom/server';

interface MachineDetailMapProps {
  latitude: number;
  longitude: number;
  zoom?: boolean;
  markerType: string;
}

const MachineDetailMap: React.ComponentType<MachineDetailMapProps> = ({
  latitude,
  longitude,
  zoom = true,
  markerType = "exc",
}) => {
  const mapRef = useRef<Map>(null);

  const customIcon = L.divIcon({
    className: 'custom-icon',
    html: ReactDOMServer.renderToString(<CustomMapMarker type={markerType} />),
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  return (
    <div className="flex items-center justify-center w-full overflow-hidden rounded-[10px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        ref={mapRef}
        className="z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            <div>
              <h1>Machine Detail Map</h1>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="absolute bottom-0 z-20 w-full h-8 m-4 overflow-hidden rounded">
        <div className="flex items-center justify-between w-full h-full px-3">
          <div className="w-[32px] h-[32px] bg-white rounded-[10px] flex items-center justify-center cursor-pointer">
            <SvgIcons iconName="FullScreen" fill="#B9C2CA" />
          </div>

          <div className="flex justify-end w-full gap-2">
            {zoom && (
              <>
                <div
                  id="zoom-in"
                  className="w-[32px] h-[32px] bg-white rounded-[10px] flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    mapRef.current?.zoomIn();
                  }}
                >
                  <SvgIcons iconName="ZoomIn" fill="#B9C2CA" />
                </div>

                <div
                  id="zoom-out"
                  className="w-[32px] h-[32px] bg-white rounded-[10px] flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    mapRef.current?.zoomOut();
                  }}
                >
                  <SvgIcons iconName="ZoomOut" fill="#B9C2CA" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetailMap;

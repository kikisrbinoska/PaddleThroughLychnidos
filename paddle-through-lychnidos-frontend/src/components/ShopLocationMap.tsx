import { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { createShopIcon } from "../utils/shopMarkerIcon";
import "leaflet/dist/leaflet.css";

export interface ShopLocationMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

// Small, non-interactive-feeling map centered on a single shop - reuses
// the same marker icon as the full Map screen so pins look consistent
// across the app.
export function ShopLocationMap({
  latitude,
  longitude,
  className = "",
}: ShopLocationMapProps) {
  const icon = useMemo(() => createShopIcon(), []);
  const position: [number, number] = [latitude, longitude];

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={icon} />
      </MapContainer>
    </div>
  );
}

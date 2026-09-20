import { useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LeafletEvent } from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import { createShopIcon } from "../utils/shopMarkerIcon";
import "leaflet/dist/leaflet.css";

// Ohrid town center - used whenever the artisan hasn't set a location yet,
// since every shop in this app is somewhere around Lake Ohrid.
const DEFAULT_CENTER: [number, number] = [41.1172, 20.8016];

export interface ShopLocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (latitude: number, longitude: number) => void;
  className?: string;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function ShopLocationPicker({
  latitude,
  longitude,
  onChange,
  className = "",
}: ShopLocationPickerProps) {
  const icon = useMemo(() => createShopIcon(), []);
  const markerRef = useRef<LeafletMarker | null>(null);

  // (0, 0) is the AddRequest/EditRequest default when an artisan hasn't
  // picked a location yet - treat it the same as "unset" here and center
  // the map on Ohrid instead of the middle of the Atlantic.
  const hasPosition = latitude !== 0 || longitude !== 0;
  const position: [number, number] = hasPosition ? [latitude, longitude] : DEFAULT_CENTER;

  function handleDragEnd(event: LeafletEvent) {
    const marker = event.target as LeafletMarker;
    const { lat, lng } = marker.getLatLng();
    onChange(lat, lng);
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-border-default">
        <MapContainer
          center={position}
          zoom={hasPosition ? 16 : 14}
          scrollWheelZoom={true}
          className="h-56 w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler onChange={onChange} />
          {hasPosition && (
            <Marker
              position={position}
              icon={icon}
              draggable
              eventHandlers={{ dragend: handleDragEnd }}
              ref={markerRef}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-text-secondary">
        {hasPosition
          ? `Tap the map or drag the pin to adjust. ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
          : "Tap the map to place your shop's pin."}
      </p>
    </div>
  );
}

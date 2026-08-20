import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// Numbered pin for itinerary stops, styled like createShopIcon's teardrop
// marker (see shopMarkerIcon.tsx) but carrying the stop's order number so
// the map and the timeline list below it can be visually matched up.
// Highlighted stops (tapped in the timeline) render in the secondary accent
// color so the selection is obvious at a glance.
export function createItineraryStopIcon(order: number, isHighlighted = false): L.DivIcon {
  const background = isHighlighted ? "#1E9E3C" : "#1570EF";

  const html = renderToStaticMarkup(
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50% 50% 50% 0",
        background,
        transform: "rotate(-45deg)",
        border: "2px solid white",
        boxShadow: isHighlighted
          ? "0 0 0 4px rgba(30,158,60,0.25), 0 1px 4px rgba(0,0,0,0.35)"
          : "0 1px 4px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          transform: "rotate(45deg)",
          color: "white",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "'Manrope', system-ui, sans-serif",
        }}
      >
        {order}
      </span>
    </div>,
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

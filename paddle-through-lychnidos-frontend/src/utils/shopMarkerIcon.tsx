import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

export function createShopIcon(): L.DivIcon {
  const html = renderToStaticMarkup(
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50% 50% 50% 0",
        background: "#1570EF",
        transform: "rotate(-45deg)",
        border: "2px solid white",
        boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
      }}
    />,
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

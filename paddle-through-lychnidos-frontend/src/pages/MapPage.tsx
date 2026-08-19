import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { SlidersHorizontal } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { regionService } from "../services/regionService";
import { categoryService } from "../services/categoryService";
import { shopService } from "../services/shopService";
import type { Category, Region, ShopListItem } from "../types";
import { FilterBottomSheet, type ShopFilters } from "../components/FilterBottomSheet";
import "leaflet/dist/leaflet.css";

// Ohrid town center.
const MAP_CENTER: [number, number] = [41.1172, 20.8016];
const MAP_ZOOM = 13;

const REGION_FILL_COLORS = ["#52BEFA", "#7ADB83"];

interface ParsedRegion {
  region: Region;
  positions: [number, number][];
  bounds: L.LatLngBoundsExpression;
  color: string;
}

function parseRegionPolygon(region: Region, colorIndex: number): ParsedRegion | null {
  try {
    const geometry = JSON.parse(region.polygonGeoJson) as {
      type: string;
      coordinates: number[][][];
    };
    if (geometry.type !== "Polygon") return null;

    // GeoJSON coordinates are [lng, lat]; Leaflet positions are [lat, lng].
    const positions = geometry.coordinates[0].map(
      ([lng, lat]) => [lat, lng] as [number, number],
    );

    return {
      region,
      positions,
      bounds: L.latLngBounds(positions),
      color: REGION_FILL_COLORS[colorIndex % REGION_FILL_COLORS.length],
    };
  } catch {
    return null;
  }
}

function createShopIcon(): L.DivIcon {
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

const EMPTY_FILTERS: ShopFilters = {
  searchWord: "",
  categoryId: null,
  regionId: null,
};

const MAP_CENTER_BOUNDS: L.LatLngBoundsExpression = L.latLngBounds(
  [MAP_CENTER[0] - 0.03, MAP_CENTER[1] - 0.03],
  [MAP_CENTER[0] + 0.03, MAP_CENTER[1] + 0.03],
);

interface MapFlyToHandlerProps {
  bounds: L.LatLngBoundsExpression | null;
}

// Imperatively drives the Leaflet map instance to fly to a region's bounds
// whenever it changes - MapContainer's own props only set the *initial*
// view, so panning/zooming afterwards has to go through the map instance.
function MapFlyToHandler({ bounds }: MapFlyToHandlerProps) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [32, 32], maxZoom: 17 });
    }
  }, [bounds, map]);

  return null;
}

export function MapPage() {
  const [searchParams] = useSearchParams();
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<ShopListItem[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ShopFilters>(EMPTY_FILTERS);
  const [focusedBounds, setFocusedBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  const shopIcon = useMemo(() => createShopIcon(), []);

  useEffect(() => {
    regionService.getAll().then(setRegions);
    categoryService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    shopService
      .getAll({
        searchWord: appliedFilters.searchWord || undefined,
        categoryId: appliedFilters.categoryId ?? undefined,
        regionId: appliedFilters.regionId ?? undefined,
        pageSize: 100,
      })
      .then((response) => setShops(response.items));
  }, [appliedFilters]);

  const parsedRegions = useMemo(
    () =>
      regions
        .map((region, index) => parseRegionPolygon(region, index))
        .filter((value): value is ParsedRegion => value !== null),
    [regions],
  );

  // Drives both the shop filter and the camera focus off the ?regionId=
  // URL param. Re-runs whenever the param changes - including navigating
  // from /map?regionId=1 to /map?regionId=2 while already on this page,
  // which React Router does not remount for (same route, new query string).
  useEffect(() => {
    const regionIdParam = searchParams.get("regionId");
    const regionId = regionIdParam ? Number(regionIdParam) : null;

    setAppliedFilters((current) =>
      current.regionId === regionId ? current : { ...current, regionId },
    );

    if (regionId === null || parsedRegions.length === 0) return;
    const match = parsedRegions.find((parsed) => parsed.region.id === regionId);
    if (match) setFocusedBounds(match.bounds);
  }, [searchParams, parsedRegions]);

  const activeFilterCount = [
    appliedFilters.searchWord,
    appliedFilters.categoryId,
    appliedFilters.regionId,
  ].filter((value) => value !== null && value !== "").length;

  function openFilters() {
    setDraftFilters(appliedFilters);
    setIsFilterOpen(true);
  }

  function focusRegion(parsed: ParsedRegion) {
    setFocusedBounds(parsed.bounds);
  }

  function resetView() {
    setFocusedBounds(MAP_CENTER_BOUNDS);
  }

  return (
    <div className="relative h-[calc(100svh-64px)] w-full pb-16">
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="h-full w-full"
      >
        <MapFlyToHandler bounds={focusedBounds} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {parsedRegions.map((parsed) => (
          <Polygon
            key={parsed.region.id}
            positions={parsed.positions}
            eventHandlers={{
              click: () => focusRegion(parsed),
            }}
            pathOptions={{
              color: parsed.color,
              weight: 2,
              fillColor: parsed.color,
              fillOpacity: 0.35,
            }}
          >
            <Tooltip permanent direction="center" className="region-label">
              {parsed.region.name}
            </Tooltip>
          </Polygon>
        ))}

        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.latitude, shop.longitude]}
            icon={shopIcon}
          >
            <Popup>
              <div className="flex w-40 flex-col gap-1">
                {shop.imageUrl && (
                  <img
                    src={shop.imageUrl}
                    alt={shop.name}
                    className="h-20 w-full rounded object-cover"
                  />
                )}
                <p className="text-sm font-bold text-text-primary">
                  {shop.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {shop.categoryName}
                </p>
                <Link
                  to={`/shop/${shop.id}`}
                  className="mt-1 text-xs font-semibold text-primary-800"
                >
                  View Shop
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {focusedBounds && (
        <button
          type="button"
          onClick={resetView}
          className="absolute left-4 top-4 z-[500] rounded-full bg-surface-card px-4 py-2 text-xs font-semibold text-primary-900 shadow-lg"
        >
          Back to full map
        </button>
      )}

      <button
        type="button"
        onClick={openFilters}
        aria-label="Open filters"
        className="absolute bottom-4 right-4 z-[500] flex h-14 w-14 items-center justify-center rounded-full bg-primary-900 text-white shadow-lg"
      >
        <SlidersHorizontal size={22} />
        {activeFilterCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nosija-red-700 text-[10px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        regions={regions}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={() => setAppliedFilters(draftFilters)}
      />
    </div>
  );
}

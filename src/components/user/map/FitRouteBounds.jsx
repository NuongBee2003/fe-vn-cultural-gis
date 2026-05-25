import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * @param {{ positions: [number, number][] | null }} props
 */
export default function FitRouteBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions?.length) return;
    map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
  }, [map, positions]);

  return null;
}

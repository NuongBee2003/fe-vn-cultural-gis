import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * @param {{ position: [number, number] | null }} props
 */
export default function FlyToSelected({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.75 });
  }, [map, position]);

  return null;
}

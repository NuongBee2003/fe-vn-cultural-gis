const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

/**
 * @param {{ lat: number; lng: number }} start
 * @param {{ lat: number; lng: number }} end
 */
export async function fetchDrivingRoute(start, end) {
  const coords = `${start.lng},${start.lat};${end.lng},${end.lat}`;
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Không thể kết nối dịch vụ chỉ đường.");
  }

  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.[0]) {
    throw new Error(data.message || "Không tìm được tuyến đường.");
  }

  const route = data.routes[0];
  const positions = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

  return {
    positions,
    distanceMeters: route.distance,
    durationSeconds: route.duration,
  };
}

/** @param {number} meters */
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/** @param {number} seconds */
export function formatDuration(seconds) {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `~${mins} phút`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `~${h} giờ ${m} phút` : `~${h} giờ`;
}

/**
 * Khoảng cách chim bay (ước lượng nhanh khi chưa có tuyến OSRM).
 * @param {{ lat: number; lng: number }} a
 * @param {{ lat: number; lng: number }} b
 */
export function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

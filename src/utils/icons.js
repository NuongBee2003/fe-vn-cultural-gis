import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Simplified SVGs and icon HTML generation moved here.
export function createCustomIcon(markerColor, innerSvg, { active = false } = {}) {
  const size = active ? 44 : 32;
  const inner = active ? 22 : 16;
  const anchor = size / 2;

  let contentHtml = "";
  if (typeof innerSvg === "string") {
    const trimmed = innerSvg.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("data:image")
    ) {
      contentHtml = `<img src="${trimmed}" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;" />`;
    } else {
      contentHtml = innerSvg;
    }
  }

  const html = `
    <div class="custom-marker-inner" style="
      width: ${size}px; height: ${size}px;
      background: ${markerColor};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: ${
        active
          ? "0 0 0 4px rgba(37, 99, 235, 0.35), 0 4px 16px rgba(0,0,0,0.35)"
          : "0 2px 8px rgba(0,0,0,0.3)"
      };
      border: ${active ? "3px solid #2563eb" : "2px solid rgba(255,255,255,0.35)"};
      transition: transform 0.15s ease;
      transform: ${active ? "scale(1.05)" : "none"};
    ">
      <div style="width: ${inner}px; height: ${inner}px; display:flex; align-items:center; justify-content:center;">
        ${contentHtml}
      </div>
    </div>`;

  return L.divIcon({
    html,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    className: active ? "marker-active" : "",
  });
}


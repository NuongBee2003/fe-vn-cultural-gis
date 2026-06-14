/**
 * API Client cho các dịch vụ liên quan đến Văn hóa (Cuisine, Custom, Folk Art)
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getAuthToken() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  }
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

// Generic helper for GET requests
async function getRequest(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error(`❌ Lỗi khi lấy dữ liệu từ ${endpoint}:`, error);
    throw error;
  }
}

// Generic helper for authenticated write requests (POST, PUT, DELETE)
async function writeRequest(endpoint, method, body = null) {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    
    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }
    
    const res = await fetch(`${BASE_URL}/${endpoint}`, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gửi yêu cầu ${method} tới ${endpoint}:`, error);
    throw error;
  }
}

// --- CUISINES (ẨM THỰC) ---
export const getCuisines = () => getRequest("cuisine");
export const getCuisineDetail = (id) => getRequest(`cuisine/${id}`);
export const createCuisine = (data) => writeRequest("cuisine", "POST", data);
export const updateCuisine = (id, data) => writeRequest(`cuisine/${id}`, "PUT", data);
export const deleteCuisine = (id) => writeRequest(`cuisine/${id}`, "DELETE");
export const addCuisineRecommendation = (id, placeId, notes) => writeRequest(`cuisine/${id}/recommend`, "POST", { place_id: placeId, notes });
export const removeCuisineRecommendation = (recId) => writeRequest(`cuisine/recommend/${recId}`, "DELETE");

// --- CUSTOMS (PHONG TỤC) ---
export const getCustoms = () => getRequest("custom");
export const getCustomDetail = (id) => getRequest(`custom/${id}`);
export const createCustom = (data) => writeRequest("custom", "POST", data);
export const updateCustom = (id, data) => writeRequest(`custom/${id}`, "PUT", data);
export const deleteCustom = (id) => writeRequest(`custom/${id}`, "DELETE");

// --- FOLK ARTS (NGHỆ THUẬT DÂN GIAN) ---
export const getFolkArts = () => getRequest("folk-art");
export const getFolkArtDetail = (id) => getRequest(`folk-art/${id}`);
export const createFolkArt = (data) => writeRequest("folk-art", "POST", data);
export const updateFolkArt = (id, data) => writeRequest(`folk-art/${id}`, "PUT", data);
export const deleteFolkArt = (id) => writeRequest(`folk-art/${id}`, "DELETE");

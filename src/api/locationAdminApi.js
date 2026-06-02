/**
 * locationAdminApi.js
 * Admin API Client cho quản lý Location (CRUD)
 *
 * Dựa trên BE routes (LocationRouter.js):
 *   POST   /api/v1/location       → create  (Place + Location + Assets)
 *   PUT    /api/v1/location/:id   → update  (Place + Location + Assets)
 *   DELETE /api/v1/location/:id   → delete
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

// ─── Helpers ──────────────────────────────────────────────

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── API Calls ────────────────────────────────────────────

/**
 * Tạo mới địa điểm (Place + Location + Assets trong 1 transaction)
 * @param {Object} data
 * @param {string}   data.name          Tên địa điểm (bắt buộc nếu không có place_id)
 * @param {string}   [data.description]
 * @param {number}   [data.category_id]
 * @param {number}   [data.place_id]    Gắn vào Place đã có
 * @param {number}   [data.lat]
 * @param {number}   [data.lng]
 * @param {string}   [data.address]
 * @param {string[]} [data.images]      Mảng URL ảnh từ Supabase (ảnh đầu = primary)
 */
export async function createLocation(data) {
  const res = await fetch(`${API_URL}/location`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Cập nhật địa điểm (Place + Location + Assets trong 1 transaction)
 * Chỉ truyền các field muốn thay đổi.
 * LƯU Ý: Nếu truyền images (kể cả []) → xóa ảnh cũ và thay bằng ảnh mới.
 *        Nếu KHÔNG truyền images → ảnh giữ nguyên.
 *
 * @param {number} id   Location ID
 * @param {Object} data Các field cần cập nhật
 */
export async function updateLocation(id, data) {
  const res = await fetch(`${API_URL}/location/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Xóa một location
 * @param {number} id Location ID
 */
export async function deleteLocation(id) {
  const res = await fetch(`${API_URL}/location/${id}`, {
    method: "DELETE",
    headers: { Authorization: getAuthHeaders().Authorization || "" },
  });
  return handleResponse(res);
}

// ─── React Query Hooks ────────────────────────────────────

const INVALIDATE_KEYS = [["locations", "all"], ["locations", "geo"]];

function invalidateLocations(queryClient) {
  INVALIDATE_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => invalidateLocations(queryClient),
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateLocation(id, data),
    onSuccess: () => invalidateLocations(queryClient),
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => invalidateLocations(queryClient),
  });
}

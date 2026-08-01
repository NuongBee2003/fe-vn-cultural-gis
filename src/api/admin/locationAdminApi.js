/**
 * locationAdminApi.js
 * Admin API Client cho quản lý Location (CRUD)
 *
 * Dựa trên BE routes (LocationRouter.js):
 *   POST   /api/v1/location       → create  (Place + Location + Assets)
 *   PUT    /api/v1/location/:id   → update  (Place + Location + Assets)
 *   DELETE /api/v1/location/:id   → delete
 */
import { useCallback, useState } from "react";

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
 */
export async function deleteLocation(id) {
  const res = await fetch(`${API_URL}/location/${id}`, {
    method: "DELETE",
    headers: { Authorization: getAuthHeaders().Authorization || "" },
  });
  return handleResponse(res);
}

/**
 * Xóa một địa điểm (Place)
 */
export async function deletePlace(id) {
  const res = await fetch(`${API_URL}/place/${id}`, {
    method: "DELETE",
    headers: { Authorization: getAuthHeaders().Authorization || "" },
  });
  return handleResponse(res);
}

/**
 * Tạo mới địa điểm (Place + locations + assets)
 */
export async function createPlace(data) {
  const res = await fetch(`${API_URL}/place`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

/**
 * Cập nhật địa điểm (Place + locations + assets)
 */
export async function updatePlace(id, data) {
  const res = await fetch(`${API_URL}/place/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

function useAsyncMutation(action) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (variables, options = {}) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await action(variables);
        options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        setError(err);
        options.onError?.(err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [action]
  );

  return { mutate, mutateAsync: mutate, isPending, error };
}

export function useCreateLocation() {
  return useAsyncMutation(createLocation);
}

export function useUpdateLocation() {
  return useAsyncMutation(({ id, data }) => updateLocation(id, data));
}

export function useDeleteLocation() {
  return useAsyncMutation(deleteLocation);
}

export function useDeletePlace() {
  return useAsyncMutation(deletePlace);
}

export function useCreatePlace() {
  return useAsyncMutation(createPlace);
}

export function useUpdatePlace() {
  return useAsyncMutation(({ id, data }) => updatePlace(id, data));
}

/**
 * Xóa một review (admin hoặc chủ review)
 */
export async function deleteReview(placeId, reviewId) {
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  const res = await fetch(`${API_URL}/place/${placeId}/review/${reviewId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export function useDeleteReview() {
  return useAsyncMutation(({ placeId, reviewId }) => deleteReview(placeId, reviewId));
}

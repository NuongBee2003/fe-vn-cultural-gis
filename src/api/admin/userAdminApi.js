/**
 * API Client cho Quản lý người dùng (Admin)
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getAdminToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
}

/**
 * Lấy danh sách toàn bộ người dùng (Admin only)
 */
export async function getAdminUsers() {
  const token = getAdminToken();
  if (!token) throw new Error("Yêu cầu đăng nhập Admin");

  const res = await fetch(`${BASE_URL}/user/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }

  const result = await res.json();
  return result.data || [];
}

/**
 * Cập nhật role của một user (Admin only)
 * @param {number} id
 * @param {string} role  'admin' | 'user'
 */
export async function updateUserRole(id, role) {
  const token = getAdminToken();
  if (!token) throw new Error("Yêu cầu đăng nhập Admin");

  const res = await fetch(`${BASE_URL}/user/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }

  const result = await res.json();
  return result.data;
}

/**
 * Cập nhật trạng thái của một user (Admin only)
 * @param {number} id
 * @param {string} status 'active' | 'banned'
 */
export async function updateUserStatus(id, status) {
  const token = getAdminToken();
  if (!token) throw new Error("Yêu cầu đăng nhập Admin");

  const res = await fetch(`${BASE_URL}/user/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP error! status: ${res.status}`);
  }

  const result = await res.json();
  return result.data;
}

/**
 * API Client cho các dịch vụ liên quan đến Thông báo (Notification)
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getAuthToken() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  }
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

/**
 * Lấy danh sách thông báo của người dùng hiện tại
 */
export async function getNotifications() {
  try {
    const token = getAuthToken();
    if (!token) return [];

    const res = await fetch(`${BASE_URL}/notification`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách thông báo:", error);
    return [];
  }
}

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export async function markAllNotificationsAsRead() {
  try {
    const token = getAuthToken();
    if (!token) return { success: false };

    const res = await fetch(`${BASE_URL}/notification/read-all`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || { success: true };
  } catch (error) {
    console.error("❌ Lỗi khi đánh dấu đã đọc tất cả thông báo:", error);
    return { success: false };
  }
}

/**
 * Đánh dấu 1 thông báo cụ thể là đã đọc
 * @param {number|string} id ID của thông báo
 */
export async function markNotificationAsRead(id) {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const res = await fetch(`${BASE_URL}/notification/${id}/read`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi đánh dấu đã đọc thông báo ${id}:`, error);
    return null;
  }
}

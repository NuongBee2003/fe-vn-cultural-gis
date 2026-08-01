const BASE_URL = import.meta.env.VITE_API_URL?.trim() ?? "http://localhost:3002/api/v1";

function getToken() {
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

export const userApi = {
  /**
   * Lấy danh sách tất cả users (dùng cho tính năng @mention).
   * Yêu cầu người dùng đã đăng nhập.
   * @returns {Promise<Array<{id, username, avatar}>>}
   */
  getAllUsers: async () => {
    const token = getToken();
    if (!token) return [];

    const res = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    return res.json();
  },
};

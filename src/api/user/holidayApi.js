const BASE_URL = import.meta.env.VITE_API_URL?.trim() ?? "http://localhost:3002/api/v1";

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const holidayApi = {
  /**
   * Lấy danh sách tất cả các ngày lễ từ database.
   * Hỗ trợ tìm kiếm, phân trang nếu truyền các tham số.
   */
  getAllHolidays: async (params = {}) => {
    const { page, limit, search, category } = params;
    const query = new URLSearchParams();
    if (page) query.append("page", page);
    if (limit) query.append("limit", limit);
    if (search) query.append("search", search);
    if (category) query.append("category", category);

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${BASE_URL}/holiday${queryString}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    const result = await res.json();
    return result; // Trả về toàn bộ kết quả gồm success, data, pagination
  },

  createHoliday: async (data) => {
    const res = await fetch(`${BASE_URL}/holiday`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  updateHoliday: async (id, data) => {
    const res = await fetch(`${BASE_URL}/holiday/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },

  deleteHoliday: async (id) => {
    const res = await fetch(`${BASE_URL}/holiday/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: getAuthHeaders().Authorization || "",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    return res.json();
  },
};

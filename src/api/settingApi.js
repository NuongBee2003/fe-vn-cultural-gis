const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

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

export const settingApi = {
  // Lấy tất cả cấu hình
  getAllSettings: async () => {
    const res = await fetch(`${API_URL}/setting`);
    return handleResponse(res);
  },

  // Cập nhật mảng cấu hình
  updateSettings: async (settings) => {
    const res = await fetch(`${API_URL}/setting`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings }),
    });
    return handleResponse(res);
  },
};

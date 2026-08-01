const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
}

export const productApi = {
  getAll: async (query = '', page = 1, limit = 20, userId = null) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (userId) params.append('userId', userId);

    const res = await fetch(`${BASE_URL}/product?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch products");
    }
    return await res.json();
  },

  getDetail: async (id) => {
    const res = await fetch(`${BASE_URL}/product/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch product detail");
    }
    const result = await res.json();
    return result.data;
  },

  create: async (productData) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create product");
    }
    return await res.json();
  },

  update: async (id, productData) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update product");
    }
    return await res.json();
  },

  delete: async (id) => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/product/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete product");
    }
    return await res.json();
  },
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getToken() {
  return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
}

export const subscriptionApi = {
  getMyActive: async () => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/subscription/my-active`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch active subscription");
    }
    const result = await res.json();
    return result.data;
  },

  subscribe: async (packageId, businessName = "", businessPhone = "") => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/subscription/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ packageId, businessName, businessPhone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Subscription upgrade failed");
    }
    return await res.json();
  },

  getMyHistory: async () => {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/subscription/my-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch subscription history");
    }
    const result = await res.json();
    return result.data || [];
  },
};

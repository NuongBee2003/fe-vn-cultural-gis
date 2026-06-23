const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

function getAuthToken() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  }
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

export const reviewApi = {
  getAllReviewsAdmin: async (params) => {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.limit) queryParams.append("limit", params.limit);
    if (params?.query) queryParams.append("query", params.query);

    const url = `${BASE_URL}/review/admin/all?${queryParams.toString()}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },

  deleteReview: async (id) => {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/review/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  },
};

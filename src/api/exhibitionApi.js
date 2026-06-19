/**
 * API Client cho các dịch vụ liên quan đến Triển lãm ảo (Exhibition)
 * Kết nối trực tiếp với backend Express.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

// Helper lấy Token hiện tại
function getAuthToken() {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return localStorage.getItem("adminToken") || localStorage.getItem("token") || "";
  }
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

/**
 * 1. Lấy danh sách triển lãm ảo đã duyệt (hoặc của chính user đăng nhập)
 */
export async function getExhibitions(params) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.province) {
      queryParams.append("province", params.province);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/exhibition?${queryString}` : `${BASE_URL}/exhibition`;

    const res = await fetch(url, {
      method: "GET",
      headers: headers
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách triển lãm:", error);
    throw error;
  }
}

/**
 * 2. Admin lấy danh sách tất cả triển lãm ảo
 * @param {string} [status] Lọc theo trạng thái ('pending' | 'accepted' | 'rejected')
 */
export async function getAdminExhibitions(status) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập Admin");

    const queryParams = new URLSearchParams();
    if (status) {
      queryParams.append("status", status);
    }

    const url = `${BASE_URL}/exhibition/admin?${queryParams.toString()}`;
    const res = await fetch(url, {
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
    console.error("❌ Lỗi khi lấy danh sách triển lãm Admin:", error);
    throw error;
  }
}

/**
 * 3. Lấy chi tiết 1 tác phẩm triển lãm theo ID
 */
export async function getExhibitionDetail(id) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/exhibition/${id}`, {
      method: "GET",
      headers: headers
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy chi tiết triển lãm ${id}:`, error);
    throw error;
  }
}

/**
 * 4. Tạo tác phẩm triển lãm mới
 */
export async function createExhibition(exhibitionData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để đăng triển lãm");

    const res = await fetch(`${BASE_URL}/exhibition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exhibitionData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo triển lãm:", error);
    throw error;
  }
}

/**
 * 5. Chỉnh sửa tác phẩm triển lãm
 */
export async function updateExhibition(id, exhibitionData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để cập nhật triển lãm");

    const res = await fetch(`${BASE_URL}/exhibition/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(exhibitionData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật triển lãm ${id}:`, error);
    throw error;
  }
}

/**
 * 6. Xóa tác phẩm triển lãm
 */
export async function deleteExhibition(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để xóa triển lãm");

    const res = await fetch(`${BASE_URL}/exhibition/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi xóa triển lãm ${id}:`, error);
    throw error;
  }
}

/**
 * 7. Phê duyệt/từ chối triển lãm (Admin)
 * @param {number|string} id ID của triển lãm
 * @param {string} status Trạng thái duyệt ('accepted' | 'rejected')
 */
export async function reviewExhibition(id, status) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập Admin để duyệt triển lãm");

    const res = await fetch(`${BASE_URL}/exhibition/${id}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi duyệt triển lãm ${id}:`, error);
    throw error;
  }
}

/**
 * 8. Thích/Bỏ thích triển lãm ảo
 * @param {number|string} id ID của triển lãm
 * @param {string} action Hành động ('like' | 'unlike')
 */
export async function toggleLikeExhibition(id, action) {
  try {
    const res = await fetch(`${BASE_URL}/exhibition/${id}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data; // Trả về { id, likes }
  } catch (error) {
    console.error(`❌ Lỗi khi thích triển lãm ${id}:`, error);
    throw error;
  }
}

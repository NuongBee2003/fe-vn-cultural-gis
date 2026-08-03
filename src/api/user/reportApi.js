/**
 * API Client cho tính năng Báo cáo (Report)
 * Kết nối trực tiếp với backend Express (/api/v1/report).
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

// Helper lấy Token hiện tại
function getAuthToken() {
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

/**
 * Gửi báo cáo mới (về địa điểm hoặc bình luận)
 * @param {Object} payload - { location_id, comment_id, report_type, description }
 */
export async function createReport({ location_id, comment_id, report_type, description }) {
  try {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/report`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        location_id: location_id ? Number(location_id) : undefined,
        comment_id: comment_id ? Number(comment_id) : undefined,
        report_type,
        description: description?.trim() || "",
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result.message || `Lỗi hệ thống (${res.status})`);
    }

    return result.data || result;
  } catch (error) {
    console.error("❌ Lỗi khi gửi báo cáo:", error);
    throw error;
  }
}

/**
 * [ADMIN] Lấy danh sách báo cáo
 */
export async function getAllReports({ page = 1, limit = 20, status, report_type } = {}) {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (status) queryParams.append("status", status);
    if (report_type) queryParams.append("report_type", report_type);

    const res = await fetch(`${BASE_URL}/report?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || `Lỗi hệ thống (${res.status})`);
    }

    return result;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách báo cáo:", error);
    throw error;
  }
}

/**
 * [ADMIN] Duyệt báo cáo (Accept - Đóng cửa địa điểm hoặc Xóa comment)
 */
export async function acceptReport(id) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/report/${id}/accept`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || `Lỗi hệ thống (${res.status})`);
    }

    return result;
  } catch (error) {
    console.error("❌ Lỗi khi duyệt báo cáo:", error);
    throw error;
  }
}

/**
 * [ADMIN] Từ chối báo cáo (Reject)
 */
export async function rejectReport(id) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/report/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || `Lỗi hệ thống (${res.status})`);
    }

    return result;
  } catch (error) {
    console.error("❌ Lỗi khi từ chối báo cáo:", error);
    throw error;
  }
}

/**
 * [ADMIN] Xóa 1 báo cáo
 */
export async function deleteReport(id) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${BASE_URL}/report/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.message || `Lỗi hệ thống (${res.status})`);
    }

    return result;
  } catch (error) {
    console.error("❌ Lỗi khi xóa báo cáo:", error);
    throw error;
  }
}

export const reportApi = {
  createReport,
  getAllReports,
  acceptReport,
  rejectReport,
  deleteReport,
};

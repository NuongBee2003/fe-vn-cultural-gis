/**
 * API Client cho các dịch vụ liên quan đến Bình luận (Comment)
 * Kết nối trực tiếp với backend Express.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api/v1";

// Helper lấy Token hiện tại
function getAuthToken() {
  return localStorage.getItem("token") || localStorage.getItem("adminToken") || "";
}

/**
 * Tạo bình luận mới (hỗ trợ cả bình luận cấp 1 và phản hồi bình luận cấp 2)
 * @param {Object} commentData - Chứa { post_id, content, parent_id }
 */
export async function createComment(commentData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để gửi bình luận");

    const res = await fetch(`${BASE_URL}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("❌ Lỗi khi đăng bình luận:", error);
    throw error;
  }
}

/**
 * Chỉnh sửa bình luận
 * @param {number|string} id - ID bình luận cần sửa
 * @param {string} content - Nội dung mới
 */
export async function updateComment(id, content) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để sửa bình luận");

    const res = await fetch(`${BASE_URL}/comment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("❌ Lỗi khi sửa bình luận:", error);
    throw error;
  }
}

/**
 * Xóa bình luận
 * @param {number|string} id - ID bình luận cần xóa
 */
export async function deleteComment(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để xóa bình luận");

    const res = await fetch(`${BASE_URL}/comment/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    return true;
  } catch (error) {
    console.error("❌ Lỗi khi xóa bình luận:", error);
    throw error;
  }
}


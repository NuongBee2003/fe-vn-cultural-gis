/**
 * API Client cho các dịch vụ liên quan đến Bài viết (Post)
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
 * 1. Lấy danh sách bài viết đã duyệt cho user (hoặc bài của chính họ nếu có đăng nhập)
 */
export async function getPosts(params) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const queryParams = new URLSearchParams();
    if (params?.date_from) {
      queryParams.append("date_from", params.date_from);
    }
    if (params?.date_to) {
      queryParams.append("date_to", params.date_to);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${BASE_URL}/post?${queryString}` : `${BASE_URL}/post`;

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
    console.error("❌ Lỗi khi lấy danh sách bài viết:", error);
    throw error;
  }
}

/**
 * 1.5. Admin lấy danh sách tất cả bài viết
 * @param {string} [status] Lọc theo trạng thái ('pending' | 'accepted' | 'rejected')
 */
export async function getAdminPosts(status) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập Admin");

    const queryParams = new URLSearchParams();
    if (status) {
      queryParams.append("status", status);
    }

    const url = `${BASE_URL}/post/admin?${queryParams.toString()}`;
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
    console.error("❌ Lỗi khi lấy danh sách bài viết Admin:", error);
    throw error;
  }
}

/**
 * 2. Lấy chi tiết 1 bài viết theo ID
 * @param {number|string} id ID của bài viết
 */
export async function getPostDetail(id) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/post/${id}`, {
      method: "GET",
      headers: headers
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi lấy chi tiết bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 3. Tạo bài viết mới
 * @param {Object} postData Dữ liệu bài viết (title, content, location_id, v.v.)
 */
export async function createPost(postData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để tạo bài viết");

    const res = await fetch(`${BASE_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo bài viết:", error);
    throw error;
  }
}

/**
 * 4. Chỉnh sửa bài viết
 * @param {number|string} id ID bài viết cần sửa
 * @param {Object} postData Dữ liệu bài viết cập nhật
 */
export async function updatePost(id, postData) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để cập nhật bài viết");

    const res = await fetch(`${BASE_URL}/post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 5. Xóa bài viết
 * @param {number|string} id ID bài viết cần xóa
 */
export async function deletePost(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để xóa bài viết");

    const res = await fetch(`${BASE_URL}/post/${id}`, {
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
    console.error(`❌ Lỗi khi xóa bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 6. Toggle Like bài viết
 * @param {number|string} id ID bài viết
 */
export async function toggleLikePost(id) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để thích bài viết");

    const res = await fetch(`${BASE_URL}/post/${id}/like`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data; // Trả về { post_id, likedYN, likeCount }
  } catch (error) {
    console.error(`❌ Lỗi khi thích/bỏ thích bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 7. Phê duyệt/từ chối bài viết (Dành cho Admin)
 * @param {number|string} id ID bài viết cần duyệt
 * @param {string} status Trạng thái duyệt ('accepted' | 'rejected')
 */
export async function reviewPost(id, status) {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Yêu cầu đăng nhập để duyệt bài viết");

    const res = await fetch(`${BASE_URL}/post/${id}/review`, {
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
    console.error(`❌ Lỗi khi phê duyệt bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 8. Lấy danh sách người đã thích bài viết
 * @param {number|string} id ID bài viết
 */
export async function getPostLikes(id) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/post/${id}/likes`, {
      method: "GET",
      headers: headers
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (error) {
    console.error(`❌ Lỗi khi lấy danh sách lượt thích của bài viết ${id}:`, error);
    throw error;
  }
}

/**
 * 9. Chia sẻ bài viết (Lấy link chia sẻ)
 * @param {number|string} id ID bài viết
 */
export async function sharePost(id) {
  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/post/${id}/share`, {
      method: "POST",
      headers: headers
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data; // Trả về { shareUrl }
  } catch (error) {
    console.error(`❌ Lỗi khi chia sẻ bài viết ${id}:`, error);
    throw error;
  }
}



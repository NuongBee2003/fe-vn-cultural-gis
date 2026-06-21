/**
 * Tiện ích giải mã JWT và quản lý thời hạn đăng nhập
 */

/**
 * Giải mã phần payload của JWT token mà không cần thư viện ngoài
 * @param {string} token 
 * @returns {Object|null} Payload của JWT hoặc null
 */
export function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi giải mã JWT:", e);
    return null;
  }
}

/**
 * Xóa thông tin đăng nhập khỏi localStorage
 */
export function clearAuthSession() {
  localStorage.removeItem("isLogin");
  localStorage.removeItem("token");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("user");
  localStorage.removeItem("adminUser");
}

// Lưu trữ ID của setInterval để có thể hủy khi thiết lập lại
let expirationInterval = null;

/**
 * Chủ động kiểm tra thời hạn token định kỳ và tự động đăng xuất khi hết hạn
 * @param {Function} [onExpire] Callback gọi khi token hết hạn
 */
export function setupTokenExpirationCheck(onExpire) {
  // Hủy bộ đếm định kỳ cũ nếu có
  if (expirationInterval) {
    clearInterval(expirationInterval);
    expirationInterval = null;
  }

  const check = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return;

    // exp nằm ở đơn vị giây, cần đổi sang mili giây
    const expirationTime = payload.exp * 1000;
    const isExpired = Date.now() >= expirationTime;

    if (isExpired) {
      console.warn("Token đã hết hạn (Chủ động định kỳ). Đang tự động đăng xuất...");
      clearAuthSession();
      
      if (expirationInterval) {
        clearInterval(expirationInterval);
        expirationInterval = null;
      }

      if (onExpire) {
        onExpire();
      } else {
        sessionStorage.setItem("sessionExpired", "true");
        // Xác định trang chuyển hướng tương ứng
        const isDashboard = window.location.pathname.startsWith('/dashboard');
        window.location.href = isDashboard ? '/admin/login' : '/login';
      }
    }
  };

  // Chạy kiểm tra ngay lập tức
  check();

  // Kiểm tra mỗi 5 giây một lần để đảm bảo phát hiện kịp thời, kể cả khi tab ở chế độ nền
  expirationInterval = setInterval(check, 5000);
}

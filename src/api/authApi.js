const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  // Login (cho cả user và admin)
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  // Register
  register: async (username, email, password, phone, avatar) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, phone, avatar }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  },

  getProfile: async () => {
    const token = authApi.getToken();
    if (!token) return null;
    const response = await fetch(`${API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Không thể tải thông tin tài khoản");
    }
    const result = await response.json();
    if (result && result.data) {
      const userObj = result.data;
      ["adminUser", "user"].forEach((key) => {
        localStorage.setItem(key, JSON.stringify(userObj));
      });
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key: "user" } }));
    }
    return result.data;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authApi.getUser();
    return user && user.role === 'admin';
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gửi yêu cầu OTP thất bại');
    }

    return data;
  },

  // Reset Password
  resetPassword: async (email, otp, newPassword) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
    }

    return data;
  },
};

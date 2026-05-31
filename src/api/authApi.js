const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  // Login (cho cả user và admin)
  login: async (email, password) => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  // Register
  register: async (username, email, password, avatar) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
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

  // Check if user is admin
  isAdmin: () => {
    const user = authApi.getUser();
    return user && user.role === 'admin';
  },
};

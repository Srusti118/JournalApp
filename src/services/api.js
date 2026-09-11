import { buildUrl, getAuthUrl } from "../constants/api";

// Default fetch options
const defaultOptions = {
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
};

// API client with authentication support
class ApiClient {
  constructor() {
    this.accessToken = null;
    this.csrfToken = null;
    this.onTokenRefresh = null;
  }

  setTokens(accessToken, csrfToken) {
    this.accessToken = accessToken;
    this.csrfToken = csrfToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.csrfToken = null;
  }

  async refreshAccessToken() {
    try {
      const res = await fetch(buildUrl("/auth/refresh-token"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        return null;
      }

      const resData = await res.json();
      const payload = resData.data;
      this.setTokens(payload.accessToken, payload.csrfToken);

      if (this.onTokenRefresh) {
        this.onTokenRefresh(payload.accessToken, payload.csrfToken);
      }

      return payload.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  async request(url, options = {}) {
    const currentToken = this.accessToken;

    const res = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...(this.csrfToken && { "X-CSRF-Token": this.csrfToken }),
        ...options.headers,
      },
    });

    // Handle token expiration
    if (res.status === 401) {
      const clone = res.clone();
      try {
        const data = await clone.json();

        if (data.code === "TOKEN_EXPIRED") {
          const newToken = await this.refreshAccessToken();

          if (newToken) {
            return fetch(url, {
              ...defaultOptions,
              ...options,
              headers: {
                ...defaultOptions.headers,
                Authorization: `Bearer ${newToken}`,
                ...(this.csrfToken && { "X-CSRF-Token": this.csrfToken }),
                ...options.headers,
              },
            });
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    return res;
  }

  // Helper methods
  get(url) {
    return this.request(url, { method: "GET" });
  }

  post(url, body) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  delete(url) {
    return this.request(url, { method: "DELETE" });
  }
}

// Singleton instance
export const api = new ApiClient();

// Auth-specific API calls
export const authApi = {
  register: async (userData) => {
    const res = await fetch(buildUrl("/auth/register"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Registration failed");
      error.code = data.code;
      throw error;
    }

    return data.data;
  },

  login: async (credentials) => {
    const res = await fetch(buildUrl("/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Login failed");
      error.code = data.code;
      throw error;
    }

    return data.data;
  },

  logout: async () => {
    const res = await fetch(buildUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    return res.json();
  },

  refreshToken: async () => {
    const res = await fetch(buildUrl("/auth/refresh-token"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error("Token refresh failed");
    }

    return data.data;
  },

  getMe: async (accessToken) => {
    const res = await fetch(buildUrl("/auth/me"), {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error("Failed to get user");
    }

    return data.data;
  },
};

// Notes API calls
export const notesApi = {
  getAll: async () => {
    const res = await api.get(buildUrl("/notes"));
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch notes");
    return data.data;
  },

  create: async (note) => {
    const res = await api.post(buildUrl("/notes"), note);
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to create note");
    return data.data;
  },

  delete: async (id) => {
    const res = await api.delete(buildUrl(`/notes/${id}`));
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to delete note");
    return data;
  },
};
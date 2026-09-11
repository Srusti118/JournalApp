import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { api, authApi } from "../services/api";
import { buildUrl } from "../constants/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef(null);
  const [csrfToken, setCsrfToken] = useState(() => {
    const token = localStorage.getItem("csrfToken");
    if (token === "undefined" || token === "null") {
      localStorage.removeItem("csrfToken");
      return null;
    }
    return token;
  });

  // Update access token without triggering re-render
  const setAccessToken = useCallback((token) => {
    accessTokenRef.current = token;
  }, []);

  // Update tokens from server response
  const updateTokens = useCallback(
    (accessToken, newCsrfToken) => {
      setAccessToken(accessToken);
      api.setTokens(accessToken, newCsrfToken);

      if (newCsrfToken) {
        setCsrfToken(newCsrfToken);
        localStorage.setItem("csrfToken", newCsrfToken);
      }
    },
    [setAccessToken]
  );

  // Handle successful auth (login/register)
  const handleAuthSuccess = useCallback(
    (data) => {
      const { user: userData, accessToken, csrfToken: newCsrfToken } = data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      updateTokens(accessToken, newCsrfToken);

      return userData;
    },
    [updateTokens]
  );

  // Login
  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  // Register
  const register = useCallback(
    async (userData) => {
      const data = await authApi.register(userData);
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("csrfToken");
    api.clearTokens();
    setUser(null);
    setAccessToken(null);
    setCsrfToken(null);
  }, [setAccessToken]);

  const initialized = useRef(false);

  // Refresh token on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      // If we don't have a user in localStorage, no need to refresh tokens
      if (!localStorage.getItem("user")) {
        setLoading(false);
        return;
      }

      try {
        const newToken = await api.refreshAccessToken();
        if (!newToken) {
          logout();
        }
      } catch (error) {
        console.error("Auth init error:", error);
        logout();
      }

      setLoading(false);
    };

    initAuth();
  }, [logout]);

  // Set up token refresh callback
  useEffect(() => {
    api.onTokenRefresh = updateTokens;
  }, [updateTokens]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      accessToken: accessTokenRef.current,
      csrfToken,
      loading,
      login,
      register,
      logout,
      updateTokens,
      refreshToken: () => api.refreshAccessToken(),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
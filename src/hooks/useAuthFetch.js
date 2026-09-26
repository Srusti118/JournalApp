import { useCallback, useMemo } from "react";
import { api } from "../services/api";
import { buildUrl } from "../constants/api";

// Custom hook for authenticated API calls with auto-refresh
export function useAuthFetch() {
  // GET request
  const get = useCallback(async (endpoint) => {
    const res = await api.get(buildUrl(endpoint));
    return res;
  }, []);

  // POST request
  const post = useCallback(async (endpoint, body) => {
    const res = await api.post(buildUrl(endpoint), body);
    return res;
  }, []);

  // PUT request
  const put = useCallback(async (endpoint, body) => {
    const res = await api.put(buildUrl(endpoint), body);
    return res;
  }, []);

  // DELETE request
  const del = useCallback(async (endpoint) => {
    const res = await api.delete(buildUrl(endpoint));
    return res;
  }, []);

  // Generic request
  const request = useCallback(async (endpoint, options = {}) => {
    const res = await api.request(buildUrl(endpoint), options);
    return res;
  }, []);

  return useMemo(
    () => ({ get, post, put, delete: del, request }),
    [get, post, put, del, request]
  );
}
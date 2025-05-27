// src/hooks/useApi.js
import { useAuth } from './AuthContext';
import { API_BASE_URL } from './config';

export function useApi() {
  const { token } = useAuth();

  const apiFetch = async (endpoint, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error (${res.status}): ${errorText}`);
      throw new Error(errorText || `API error ${res.status}`);
    }

    return res.json();
  };

  return { apiFetch };
}

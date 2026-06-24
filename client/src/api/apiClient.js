
const BASE_URL = "http://localhost:8000/api";

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: { ...headers, ...options.headers },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
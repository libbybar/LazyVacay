import { apiClient } from "./apiClient";

export const loginUser = async (credentials) => {

  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = async (userData) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};
// frontend/src/api/auth.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const { data: response } = await api.post("/auth/register", data);
  return response;
};

export const login = async (data: { email: string; password: string }) => {
  const { data: response } = await api.post("/auth/login", data);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", response.access_token);
  }
  return response;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

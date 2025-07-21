// frontend/src/api/categories.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const fetchCategories = async () => {
  try {
    const { data } = await api.get("/categories");
    return data;
  } catch (error) {
    throw new Error("Failed to fetch categories: " + error.message);
  }
};

export const createCategory = async (data: {
  name: string;
  color?: string;
}) => {
  try {
    const { data: response } = await api.post("/categories", data);
    return response;
  } catch (error) {
    throw new Error("Failed to create category: " + error.message);
  }
};

export const updateCategory = async (
  id: string,
  data: { name?: string; color?: string }
) => {
  try {
    const { data: response } = await api.put(`/categories/${id}`, data);
    return response;
  } catch (error) {
    throw new Error("Failed to update category: " + error.message);
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  } catch (error) {
    throw new Error("Failed to delete category: " + error.message);
  }
};

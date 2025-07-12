// src/api/expenses.ts
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
export const fetchExpenses = async () => {
  const { data } = await api.get("/expenses");
  return data;
};

export const createExpense = async (data: {
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
}) => {
  const { data: response } = await api.post("/expenses", data);
  return response;
};

export const deleteExpense = async (id: string) => {
  const { data } = await api.delete(`/expenses/${id}`);
  return data;
};

export const fetchSummaryByCategory = async () => {
  const { data } = await api.get("/expenses/summary/by-category");
  return data;
};

export const fetchSummaryByMonth = async () => {
  const { data } = await api.get("/expenses/summary/by-month");
  return data;
};

export const exportToCsv = async () => {
  const { data } = await api.get("/expenses/export/csv");
  return data;
};

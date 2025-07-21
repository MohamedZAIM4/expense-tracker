"use client";

import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { fetchSummaryByCategory, fetchSummaryByMonth } from "../api/expenses";
import { fetchCategories } from "../api/categories";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "./dashboard.module.css";
import Link from "next/link";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/login");
    }
  }, [router]);

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!localStorage.getItem("token"),
  });

  const {
    data: categorySummary = [],
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["summaryByCategory"],
    queryFn: fetchSummaryByCategory,
    enabled: !!localStorage.getItem("token"),
  });

  const {
    data: monthSummary = [],
    isLoading: monthLoading,
    error: monthError,
  } = useQuery({
    queryKey: ["summaryByMonth"],
    queryFn: fetchSummaryByMonth,
    enabled: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    if (!categoriesLoading && categories.length === 0 && !categoriesError) {
      router.push("/categories");
    }
  }, [categories, categoriesLoading, categoriesError, router]);

  if (categoriesLoading || categoryLoading || monthLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (categoriesError || categoryError || monthError) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          Error loading data:{" "}
          {(categoriesError || categoryError || monthError)?.message ||
            "Please log in or add data"}
        </p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          onClick={() => router.push("/login")}>
          Go to Login
        </button>
        <button
          className="mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200"
          onClick={() => router.push("/categories")}>
          Add Categories
        </button>
      </div>
    );
  }

  const categoryChartData = categorySummary.map(
    (item: { categoryName: string; total: number }) => ({
      name: item.categoryName,
      value: item.total,
    })
  );

  const monthChartData = monthSummary.map(
    (item: { month: string; total: number }) => ({
      name: item.month,
      value: item.total,
    })
  );

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Dashboard</h1>
      <div className={styles.dashboardActions}>
        <button
          className={styles.dashboardButton}
          onClick={() => router.push("/categories")}>
          Add Category
        </button>
        <button
          className={styles.dashboardButton}
          onClick={() => router.push("/expenses")}>
          Add Expense
        </button>
      </div>
      {categoryChartData.length === 0 && monthChartData.length === 0 ? (
        <div className={styles.dashboardCard}>
          <p style={{ color: "#6c6c80", marginBottom: "1.5rem" }}>
            No data available. Start by adding expenses.
          </p>
          <button
            className={styles.dashboardButton}
            onClick={() => router.push("/expenses")}>
            Add Expenses
          </button>
        </div>
      ) : (
        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardCard}>
            <h2 className={styles.dashboardCardTitle}>Expenses by Category</h2>
            {categoryChartData.length > 0 ? (
              <PieChart width={340} height={340}>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value">
                  {categoryChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <p style={{ color: "#6c6c80" }}>
                No category data available.{" "}
                <Link
                  href="/expenses"
                  style={{ color: "#6a82fb", textDecoration: "underline" }}>
                  Add expenses
                </Link>
                .
              </p>
            )}
          </div>
          <div className={styles.dashboardCard}>
            <h2 className={styles.dashboardCardTitle}>Expenses by Month</h2>
            {monthChartData.length > 0 ? (
              <BarChart width={340} height={340} data={monthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            ) : (
              <p style={{ color: "#6c6c80" }}>
                No monthly data available.{" "}
                <Link
                  href="/expenses"
                  style={{ color: "#6a82fb", textDecoration: "underline" }}>
                  Add expenses
                </Link>
                .
              </p>
            )}
          </div>
          <div
            className={styles.dashboardCard}
            style={{ gridColumn: "1 / -1" }}>
            <h2 className={styles.dashboardCardTitle}>Summary</h2>
            <div className={styles.dashboardSummaryGrid}>
              <div className={styles.dashboardSummaryCol}>
                <h3 className={styles.dashboardSummaryTitle}>By Category</h3>
                {categorySummary.length > 0 ? (
                  <ul className={styles.dashboardSummaryList}>
                    {categorySummary.map(
                      (
                        item: { categoryName: string; total: number },
                        idx: number
                      ) => (
                        <li
                          key={item.categoryName}
                          className={styles.dashboardSummaryItem}>
                          <span
                            className={styles.summaryDot}
                            style={{
                              background: COLORS[idx % COLORS.length],
                            }}></span>
                          <span className={styles.summaryLabel}>
                            {item.categoryName}
                          </span>
                          <span className={styles.summaryValue}>
                            ${item.total.toFixed(2)}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className={styles.dashboardSummaryEmpty}>
                    No category summary available.
                  </p>
                )}
              </div>
              <div className={styles.dashboardSummaryCol}>
                <h3 className={styles.dashboardSummaryTitle}>By Month</h3>
                {monthSummary.length > 0 ? (
                  <ul className={styles.dashboardSummaryList}>
                    {monthSummary.map(
                      (item: { month: string; total: number }, idx: number) => (
                        <li
                          key={item.month}
                          className={styles.dashboardSummaryItem}>
                          <span
                            className={styles.summaryDot}
                            style={{
                              background: COLORS[idx % COLORS.length],
                            }}></span>
                          <span className={styles.summaryLabel}>
                            {item.month}
                          </span>
                          <span className={styles.summaryValue}>
                            ${item.total.toFixed(2)}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className={styles.dashboardSummaryEmpty}>
                    No monthly summary available.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// src/pages/expenses.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchExpenses,
  createExpense,
  deleteExpense,
  exportToCsv,
} from "../api/expenses";
import { fetchCategories } from "../api/categories";
import ExpenseForm from "../components/ExpenseForm";
import styles from "./expenses.module.css";

export default function Expenses() {
  const queryClient = useQueryClient();
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
  });

  const handleExport = async () => {
    try {
      const csv = [
        ["Amount", "Category", "Date", "Description"],
        ...expenses.map((e) => [
          e.amount,
          e.category?.name || "",
          new Date(e.date).toLocaleDateString(),
          e.description || "",
        ]),
      ]
        .map((row) => row.join(";"))
        .join("\n");
      if (!csv || typeof csv !== "string" || csv.trim() === "") {
        alert("No data to export or export failed.");
        return;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export CSV.");
      console.error(err);
    }
  };

  if (expensesLoading || categoriesLoading)
    return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <>
      <div className={styles.topLeftButtonContainer}>
        <button
          className={styles.dashboardReturnButton}
          onClick={() => (window.location.href = "/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
      <div className={styles.expensesContainer}>
        <h1 className={styles.expensesTitle}>Expenses</h1>
        <ExpenseForm
          categories={categories}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.status === "pending"}
        />
        <button onClick={handleExport} className={styles.expenseExport}>
          Export to CSV
        </button>
        <ul className={styles.expensesList}>
          {expenses.map(
            (expense: {
              id: string;
              amount: number;
              category: { name: string };
              date: string;
              description?: string;
            }) => (
              <li key={expense.id} className={styles.expenseCard}>
                <span>
                  {expense.category.name}: ${expense.amount.toFixed(2)} on{" "}
                  {new Date(expense.date).toLocaleDateString()}
                  {expense.description && ` - ${expense.description}`}
                </span>
                <button
                  className={styles.expenseDelete}
                  onClick={() => deleteMutation.mutate(expense.id)}>
                  Delete
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </>
  );
}

// src/pages/expenses.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpenses, createExpense, deleteExpense } from "../api/expenses";
import { fetchCategories } from "../api/categories";
import styles from "./expenses.module.css";
import ExpenseForm from "../components/ExpenseForm";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense ajoutée avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la dépense.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Dépense supprimée avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la dépense.");
    },
  });

  const handleExport = async () => {
    try {
      const csv = [
        ["Amount", "Category", "Date", "Description"],
        ...expenses.map(
          (e: {
            amount: number;
            category?: { name: string };
            date: string;
            description?: string;
          }) => [
            e.amount,
            e.category?.name || "",
            new Date(e.date).toLocaleDateString(),
            e.description || "",
          ]
        ),
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Liste des dépenses", 14, 16);

    // Table header
    const headers = ["Montant", "Catégorie", "Date", "Description"];
    let y = 26;
    // Render header
    headers.forEach((header, j) => {
      doc.text(header, 14 + j * 45, y);
    });
    y += 10;
    // Render rows
    expenses.forEach(
      (e: {
        amount: number;
        category?: { name: string };
        date: string;
        description?: string;
      }) => {
        const row = [
          String(e.amount),
          e.category?.name || "",
          new Date(e.date).toLocaleDateString(),
          e.description || "",
        ];
        row.forEach((cell, j) => {
          doc.text(cell, 14 + j * 45, y);
        });
        y += 10;
      }
    );
    doc.save("expenses.pdf");
  };

  if (expensesLoading || categoriesLoading)
    return <div className="container mx-auto p-4">Loading...</div>;

  return (
    <div>
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
        <button onClick={handleExportPDF} className={styles.expenseExport}>
          Exporter PDF
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
    </div>
  );
}

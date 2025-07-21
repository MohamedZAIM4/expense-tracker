import { useState } from "react";
import styles from "./ExpenseForm.module.css";
import { useRouter } from "next/router";

interface ExpenseFormProps {
  categories: { id: string; name: string }[];
  onSubmit: (data: {
    amount: number;
    categoryId: string;
    date: string;
    description?: string;
  }) => void;
  isLoading: boolean;
}

export default function ExpenseForm({
  categories,
  onSubmit,
  isLoading,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: parseFloat(amount),
      categoryId,
      date,
      description: description || undefined,
    });
    setAmount("");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
  };

  return (
    <div className={styles.formCard}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Add New Expense</h2>
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.formLabel}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            step="0.01"
            min={0}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={styles.formSelect}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.formLabel}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.formLabel}>
            Description (optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.formInput}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={styles.formButton}>
          {isLoading ? "Adding..." : "Add Expense"}
        </button>
      </form>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.push("/categories")}>
          Add category
        </button>
      </div>
    </div>
  );
}

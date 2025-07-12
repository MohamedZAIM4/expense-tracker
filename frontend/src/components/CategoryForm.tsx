import { useState } from "react";
import styles from "./CategoryForm.module.css";

interface CategoryFormProps {
  onSubmit: (data: { name: string; color?: string }) => void;
  isLoading: boolean;
}

export default function CategoryForm({
  onSubmit,
  isLoading,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, color });
    setName("");
    setColor("#6366f1");
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconCircle}>
        {/* SVG icon here */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
          <circle cx="8.5" cy="13.5" r="1.5" />
        </svg>
      </div>
      <h2 className={styles.title}>Create Category</h2>
      <p className={styles.subtitle}>
        Add a new category to organize your content
      </p>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div
          className={styles.formGroup}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <label
            className={styles.label}
            style={{ textAlign: "center", width: "100%" }}>
            Category Name
          </label>
          <input
            className={styles.input}
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 15))}
            placeholder="Enter category name"
            required
            maxLength={15}
            style={{ textAlign: "center" }}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Category Color</label>
          <input
            className={styles.colorInput}
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span className={styles.colorHint}>
            Choose a color to identify your category
          </span>
        </div>
        <button
          className={styles.button}
          type="submit"
          disabled={isLoading || !name.trim()}>
          {isLoading ? "Creating…" : "Create category"}
        </button>
      </form>
      <div className={styles.footerHint}>
        Categories help organize and filter your content effectively
      </div>
    </div>
  );
}

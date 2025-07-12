// frontend/src/pages/categories.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/categories";
import CategoryForm from "../components/CategoryForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../components/CategoryForm.module.css";

export default function Categories() {
  const qc = useQueryClient();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  /* -- redirection si non connecté -- */
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token"))
      router.push("/login");
  }, [router]);

  /* -- requête + mutations -- */
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: !!localStorage.getItem("token"),
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setEditValue("");
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (cat: { id: string; name: string }) => {
    setEditingId(cat.id);
    setEditValue(cat.name);
  };

  const handleEditSave = (cat: { id: string }) => {
    if (editValue.trim()) {
      updateMutation.mutate({ id: cat.id, name: editValue.trim() });
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleAddExpense = () => {
    router.push("/expenses");
  };

  /* -- états de chargement/erreur -- */
  if (isLoading) return <p>Chargement des catégories…</p>;

  if (error instanceof Error)
    return (
      <div>
        <h2>Erreur lors du chargement</h2>
        <p>{error.message}</p>
        <button onClick={() => router.push("/login")}>Aller au login</button>
      </div>
    );

  /* -- rendu normal -- */
  return (
    <div className={styles.outerContainer}>
      <div className={styles.topBar}>
        <button
          className={styles.returnButton}
          onClick={() => router.push("/dashboard")}>
          ⬅ Retour dashboard
        </button>
        <div className={styles.centerTitle}>Gestion des catégories</div>
      </div>
      <div className={styles.innerFlex}>
        <div className={styles.leftPanel}>
          <CategoryForm
            onSubmit={(d) => createMutation.mutate(d)}
            isLoading={createMutation.isPending}
          />
        </div>
        <div className={styles.rightPanel}>
          <h2 className={styles.rightTitle}>Vos catégories</h2>
          <div className={styles.categoryList}>
            {categories && categories.length > 0 ? (
              categories.map(
                (cat: { id: string; name: string; color?: string }) => (
                  <div key={cat.id} className={styles.categoryCard}>
                    <span
                      style={{ background: cat.color }}
                      className={styles.colorDot}></span>
                    {editingId === cat.id ? (
                      <>
                        <input
                          className={styles.input}
                          value={editValue}
                          onChange={(e) =>
                            setEditValue(e.target.value.slice(0, 15))
                          }
                          maxLength={15}
                          style={{ marginRight: "0.5rem" }}
                        />
                        <button
                          className={styles.iconButton}
                          onClick={() => handleEditSave(cat)}
                          disabled={updateMutation.isLoading}
                          title="Save">
                          💾
                        </button>
                        <button
                          className={styles.iconButton}
                          onClick={handleEditCancel}
                          title="Cancel">
                          ✖️
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={styles.categoryName}>{cat.name}</span>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.iconButton}
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => handleEdit(cat)}>
                            ✏️
                          </button>
                          <button
                            className={styles.iconButton}
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleteMutation.isLoading}>
                            🗑️
                          </button>
                          <button
                            className={styles.iconButton}
                            title="Add Expense"
                            aria-label="Add Expense"
                            onClick={handleAddExpense}>
                            ➕
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              )
            ) : (
              <p>Aucune catégorie. Créez‑en une ci‑dessus.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

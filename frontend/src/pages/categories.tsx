// src/pages/categories.tsx
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
import { toast } from "react-toastify";
import React from "react";

export default function Categories() {
  const qc = useQueryClient();
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showCascadeDialog, setShowCascadeDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie créée avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la catégorie.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setEditingId(null);
      setEditValue("");
      toast.success("Catégorie modifiée avec succès !");
    },
    onError: () => {
      toast.error("Erreur lors de la modification de la catégorie.");
    },
  });

  // Nouvelle mutation pour suppression en cascade
  const cascadeDeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/categories/${id}/cascade`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Toujours parser le body même en cas d'erreur
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        // On lève une erreur avec le message du backend si dispo
        throw new Error(
          data.message || "Erreur lors de la suppression en cascade"
        );
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie et dépenses supprimées avec succès !");
      setShowCascadeDialog(false);
      setCategoryToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression en cascade.");
    },
  });

  // 2. Handler de suppression avec gestion propre du toast et de la modale
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onError: (error: any) => {
        if (
          error?.message?.includes("Impossible de supprimer") ||
          error?.message?.includes("dépenses") ||
          error?.message?.includes("400")
        ) {
          setCategoryToDelete(id);
          setShowCascadeDialog(true);
          return; // NE PAS afficher de toast
        }
        toast.error(
          error.message || "Erreur lors de la suppression de la catégorie."
        );
      },
    });
  };

  // 3. Handler click avec catch global pour éviter uncaught promise
  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowCascadeDialog(true);
  };

  const handleCascadeDelete = () => {
    if (categoryToDelete) {
      cascadeDeleteMutation.mutate(categoryToDelete);
    }
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
        <button onClick={() => router.push("/login")}>
          Aller à la connexion
        </button>
      </div>
    );

  /* -- rendu normal -- */
  return (
    <div>
      <div className={styles.categoriesContainer}>
        <div className={styles.topBar}>
          <div className={styles.centerTitle}>Gestion des catégories</div>
        </div>
        <div className={styles.innerFlex}>
          <div className={styles.leftPanel}>
            <CategoryForm
              onSubmit={(d) => createMutation.mutate(d)}
              isLoading={createMutation.status === "pending"}
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
                            disabled={updateMutation.status === "pending"}
                            title="Enregistrer">
                            💾
                          </button>
                          <button
                            className={styles.iconButton}
                            onClick={handleEditCancel}
                            title="Annuler">
                            ✖️
                          </button>
                        </>
                      ) : (
                        <>
                          <span className={styles.categoryName}>
                            {cat.name}
                          </span>
                          <div className={styles.cardActions}>
                            <button
                              className={styles.iconButton}
                              title="Modifier"
                              aria-label="Modifier"
                              onClick={() => handleEdit(cat)}>
                              ✏️
                            </button>
                            <button
                              className={styles.iconButton}
                              title="Supprimer"
                              aria-label="Supprimer"
                              onClick={() => handleDeleteClick(cat.id)}
                              disabled={deleteMutation.status === "pending"}>
                              🗑️
                            </button>
                            <button
                              className={styles.iconButton}
                              title="Ajouter une dépense"
                              aria-label="Ajouter une dépense"
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
                <p>Aucune catégorie. Créez-en une ci-dessus.</p>
              )}
            </div>
          </div>
        </div>
        {showCascadeDialog && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}>
            <div
              style={{
                background: "#fff",
                padding: "2.5rem 2rem",
                borderRadius: "1.2rem",
                boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
                minWidth: 320,
                maxWidth: "90vw",
                textAlign: "center",
                fontFamily: "inherit",
              }}>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: 12,
                }}>
                Attention
              </h3>
              <p
                style={{
                  fontSize: "1.08rem",
                  color: "#22223b",
                  marginBottom: 24,
                }}>
                Si cette catégorie contient des dépenses,{" "}
                <b>elles seront supprimées aussi</b>.<br />
                Voulez-vous continuer ?
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginTop: 12,
                  justifyContent: "center",
                }}>
                <button
                  onClick={() => setShowCascadeDialog(false)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "#eee",
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}>
                  Annuler
                </button>
                <button
                  onClick={handleCascadeDelete}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: "#e53e3e",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

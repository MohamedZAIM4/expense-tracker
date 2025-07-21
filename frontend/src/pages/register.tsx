// src/pages/register.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register, login } from "../api/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: async (_, variables) => {
      try {
        await login({ email: variables.email, password: variables.password });
        toast.success("Compte créé avec succès, bienvenue !");
        router.push("/dashboard");
      } catch (e) {
        toast.error(
          "Erreur lors de la connexion automatique, veuillez vous connecter manuellement."
        );
        router.push("/login");
      }
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";
      if (msg.includes("email") && msg.includes("username")) {
        toast.error("Cet email et ce nom d’utilisateur sont déjà utilisés.");
      } else if (msg.includes("email")) {
        toast.error("Cet email est déjà utilisé.");
      } else if (msg.includes("username")) {
        toast.error("Ce nom d’utilisateur est déjà utilisé.");
      } else {
        toast.error(msg);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation custom mot de passe
    if (password.length < 10) {
      toast.error("Le mot de passe doit contenir au moins 10 caractères.");
      return;
    }
    if (new Set(password).size < 2) {
      toast.error("Le mot de passe doit contenir des caractères différents.");
      return;
    }
    mutation.mutate({ username, email, password });
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.registerTitle}>Register</h1>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.field}>
            <label className={styles.registerLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.registerInput}
              id="username"
              name="username"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.registerLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.registerInput}
              id="email"
              name="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.registerLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.registerInput}
              id="password"
              name="password"
              required
            />
          </div>
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

// src/pages/login.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useRouter } from "next/router";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => router.push("/dashboard"),
    onError: () => alert("Invalid credentials"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.field}>
            <label className={styles.loginLabel} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.loginInput}
              id="email"
              name="email"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.loginLabel} htmlFor="password">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              id="password"
              name="password"
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}

// src/pages/register.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { useRouter } from "next/router";
import styles from "./register.module.css";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => router.push("/login"),
    onError: () => alert("Registration failed"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.registerTitle}>Register</h1>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div>
            <label className={styles.registerLabel}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <div>
            <label className={styles.registerLabel}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <div>
            <label className={styles.registerLabel}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.registerInput}
              required
            />
          </div>
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
        <button
          type="button"
          className={styles.loginButton}
          onClick={() => router.push("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

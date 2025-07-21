// src/components/Navigation.tsx
import { useRouter } from "next/router";
import { logout } from "../api/auth";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.navLinks}>
          <button
            className={`${styles.navButton} ${
              router.pathname === "/dashboard" ? styles.active : ""
            }`}
            onClick={() => handleNavigate("/dashboard")}>
            Dashboard
          </button>
          <button
            className={`${styles.navButton} ${
              router.pathname === "/categories" ? styles.active : ""
            }`}
            onClick={() => handleNavigate("/categories")}>
            Categories
          </button>
          <button
            className={`${styles.navButton} ${
              router.pathname === "/expenses" ? styles.active : ""
            }`}
            onClick={() => handleNavigate("/expenses")}>
            Expenses
          </button>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

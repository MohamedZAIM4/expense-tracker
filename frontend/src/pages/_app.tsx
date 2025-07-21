// src/pages/_app.tsx
import "../styles/global.css";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

function SuppressHydrationWarning({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? children : null;
}

// Wrap Dashboard in _app.tsx
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage =
    router.pathname === "/login" || router.pathname === "/register";

  return (
    <QueryClientProvider client={queryClient}>
      <SuppressHydrationWarning>
        {isAuthPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </SuppressHydrationWarning>
    </QueryClientProvider>
  );
}

// src/pages/_app.tsx
import "../styles/global.css";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

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
  return (
    <QueryClientProvider client={queryClient}>
      <SuppressHydrationWarning>
        <Component {...pageProps} />
      </SuppressHydrationWarning>
    </QueryClientProvider>
  );
}

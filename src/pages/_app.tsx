import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "@/components/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine auth pages server-safe way using pathname from router
  const isAuthPage = router.pathname.includes("/auth");

  // First render - show what was rendered on server
  if (!mounted) {
    return isAuthPage ? (
      <Component {...pageProps} />
    ) : (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  // Client-side render - now safe to use browser APIs
  return isAuthPage ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

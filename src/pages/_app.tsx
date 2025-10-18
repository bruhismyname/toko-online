import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "@/components/common/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NotificationProvider } from "@/components/context/NotificationContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = router.pathname.includes("/auth");

  // ✅ Semua kasus dibungkus dengan NotificationProvider
  const content = isAuthPage ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  return (
    <NotificationProvider>
      {/* Saat belum mounted, tampilkan versi awal dulu */}
      {!mounted ? content : content}
    </NotificationProvider>
  );
}

"use client";
import { ReactNode } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useRouter } from "next/router";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith("/admin"); 

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

export default Layout;

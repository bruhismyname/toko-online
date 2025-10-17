import { ReactNode } from "react";
import AdminSidebar from "@/components/fragment/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 p-6">{children}</div>
    </div>
  );
}

import AdminLayout from "@/components/views/admin/layout";
import AdminDashboardView from "@/components/views/admin/dashboard";

export default function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <AdminDashboardView />
    </AdminLayout>
  );
}

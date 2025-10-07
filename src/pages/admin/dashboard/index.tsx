import AdminLayout from "@/components/views/admin/layout";
import AdminOrdersView from "@/components/views/admin/dashboard";
import AdminDashboardView from "@/components/views/admin/dashboard";

function AdminDashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      <AdminDashboardView />
    </AdminLayout>
  );
}
export default AdminDashboardPage;

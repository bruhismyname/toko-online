import AdminLayout from "@/components/views/admin/layout";
import AdminOrdersView from "@/components/views/admin/orders";

export default function AdminOrdersPage() {
  return (
    <AdminLayout title="Manajemen Pesanan">
      <AdminOrdersView />
    </AdminLayout>
  );
}

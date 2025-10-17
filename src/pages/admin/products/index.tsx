import AdminLayout from "@/components/views/admin/layout";
import AdminProductsView from "@/components/views/admin/products";

export default function AdminProductsPage() {
  return (
    <AdminLayout title="Manajemen Produk">
      <AdminProductsView />
    </AdminLayout>
  );
}
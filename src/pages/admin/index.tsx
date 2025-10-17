import Link from "next/link";
import { useEffect, useState } from "react";

function AdminIndexPage() {
    




  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin</h1>
      <ul className="list-disc pl-6">
        <li><Link className="text-blue-600 underline" href="/admin/products">Manajemen Produk</Link></li>
        <li><Link className="text-blue-600 underline" href="/admin/orders">Manajemen Pesanan</Link></li>
      </ul>
    </main>
  );
}
export default AdminIndexPage;
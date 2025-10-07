import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutGrid, Package, ClipboardList, LogOut } from "lucide-react";

type Props = { children: React.ReactNode; title?: string };

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const { pathname } = useRouter();
  const active = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
      ${active ? "bg-white text-black" : "text-gray-400 hover:bg-neutral-800 hover:text-white"}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

function AdminLayout({ children, title = "Admin" }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-white md:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="flex h-screen flex-col bg-black p-4 text-white">
        <div className="mb-6 px-2 text-lg font-bold tracking-tighter">
          Bakul Converse
        </div>
        
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
        </div>
        <nav className="space-y-1">
          <NavItem href="/admin/dashboard" icon={LayoutGrid} label="Dashboard" />
          <NavItem href="/admin/products" icon={Package} label="Manajemen Produk" />
          <NavItem href="/admin/orders" icon={ClipboardList} label="Manajemen Pesanan" />
        </nav>

        {/* Tombol Logout di bagian bawah sidebar */}
        <div className="mt-auto">
          <button
            onClick={() => alert("TODO: implement logout")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="h-screen overflow-y-auto p-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-black">
          {title}
        </h1>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
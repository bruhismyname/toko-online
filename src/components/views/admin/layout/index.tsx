import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutGrid, Package, ClipboardList, LogOut, User } from "lucide-react";

type Props = { children: React.ReactNode; title?: string };

const NavItem = ({
  href,
  icon: Icon,
  label,
}: { href: string; icon: any; label: string }) => {
  const { pathname } = useRouter();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
      ${active ? "bg-white text-gray-900 shadow" : "text-gray-200 hover:bg-white/10 hover:text-white"}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

function AdminLayout({ children, title = "Admin" }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="text-lg font-extrabold tracking-tight text-gray-900">
            Admin Panel • <span className="font-semibold text-gray-700">Bakul Converse</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
            <button
              onClick={() => alert("TODO: implement logout")}
              className="rounded-lg border border-gray-900 px-3 py-1.5 text-sm font-semibold hover:bg-gray-900 hover:text-white"
            >
              <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="h-full rounded-2xl bg-[#0f172a] p-4 text-white shadow-lg">
          <div className="mb-4 px-2 text-sm/5 text-gray-300">Menu</div>
          <nav className="space-y-1">
            <NavItem href="/admin" icon={LayoutGrid} label="Dashboard" />
            <NavItem href="/admin/products" icon={Package} label="Manajemen Produk" />
            <NavItem href="/admin/orders" icon={ClipboardList} label="Manajemen Pesanan" />
          </nav>
          <div className="mt-6 h-px bg-white/10" />
          <div className="mt-4 px-2 text-xs text-gray-400">
            Admin • Bakul Converse
          </div>
        </aside>

        {/* Content */}
        <main className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

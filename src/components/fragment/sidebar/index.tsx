import { useState } from "react";
import { useRouter } from "next/router";
import { Menu, LogOut, LayoutDashboard, Package, ShoppingCart, Users, X } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => (
  <a
    href={href}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
      active
        ? "bg-white text-black shadow-sm"
        : "text-gray-400 hover:bg-neutral-800 hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/admin/products",
      label: "Manajemen Produk",
      icon: <Package className="h-5 w-5" />,
    },
    {
      href: "/admin/orders",
      label: "Manajemen Pesanan",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      label: "Manajemen User",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg bg-black p-2 text-white hover:bg-gray-800 transition"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Bakul Converse</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-black text-white transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div 
            className="text-xl font-bold tracking-tighter cursor-pointer hover:text-gray-300 transition"
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
          >
            Bakul Converse
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden rounded-lg p-1.5 hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu Utama
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={router.pathname === item.href}
                onClick={() => handleNavClick(item.href)}
              />
            ))}
          </nav>
        </div>

        {/* Footer - Logout */}
        <div className="border-t border-neutral-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="hidden lg:block lg:w-72" />
    </>
  );
}
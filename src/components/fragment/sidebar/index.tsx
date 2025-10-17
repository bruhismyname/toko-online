import { useState } from "react";
import { useRouter } from "next/router";
import { Menu, LogOut, LayoutDashboard, Package, ShoppingCart } from "lucide-react";

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
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-white text-black"
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
      href: "/admin/products-backup",
      label: "Manajemen Produk",
      icon: <Package className="h-5 w-5" />,
    },
    {
      href: "/admin/orders-backup",
      label: "Manajemen Pesanan",
      icon: <ShoppingCart className="h-5 w-5" />,
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
      {/* Tombol menu (mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-black p-2 text-white lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-black p-4 text-white transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0`}
      >
        <div className="mb-6 px-2 text-lg font-bold tracking-tighter cursor-pointer" onClick={() => router.push("/")} >
          Bakul Converse
        </div>

        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Menu
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

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

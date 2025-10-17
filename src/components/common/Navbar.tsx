import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Menu,
  Search,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Cek apakah user sudah login
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
          setIsLoggedIn(true);
          // Ambil jumlah item di keranjang
          fetchCartCount();
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    const fetchCartCount = async () => {
      try {
        const res = await fetch("/api/cart/count");
        if (res.ok) {
          const data = await res.json();
          setCartCount(data.count || 0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    checkSession();
  }, []);

  // Handle logout
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
    <nav className="bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo dan Brand Name */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-900">
                Home
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-black">
                Products
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-black">
                About
              </Link>
            </div>
          </div>

          {/* Right Side Icons - Search, Cart, Account */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            {/* <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-600 hover:text-converse-red"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button> */}

            {/* Cart with Badge */}
            <Link
              href="/cart"
              className="text-gray-600 hover:text-converse-red relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-converse-red text-xs font-bold text-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-gray-600 hover:text-converse-red"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil Saya
                      </Link>
                      <Link
                        href="/history"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Pesanan Saya
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-converse-red text-sm"
                >
                  Login
                </Link>
                <span className="text-gray-400">|</span>
                <Link
                  href="/auth/register"
                  className="text-gray-600 hover:text-converse-red text-sm"
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (conditionally rendered) */}
        {isSearchOpen && (
          <div className="py-3 border-t border-gray-200">
            <form className="flex">
              <input
                type="text"
                placeholder="Cari sepatu Converse..."
                className="flex-grow border-2 border-r-0 rounded-l-md px-4 py-2 focus:outline-none focus:border-converse-red"
              />
              <button
                type="submit"
                className="bg-converse-red text-white px-4 py-2 rounded-r-md hover:bg-converse-black transition"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-black"
              >
                About
              </Link>
              <div className="px-3 py-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Kategori
                </h3>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/category/classic-chuck"
                    className="block pl-3 pr-4 py-1 text-sm text-gray-600 hover:text-converse-red"
                  >
                    Classic Chuck
                  </Link>
                  <Link
                    href="/category/double-stack"
                    className="block pl-3 pr-4 py-1 text-sm text-gray-600 hover:text-converse-red"
                  >
                    Double Stack
                  </Link>
                  <Link
                    href="/category/run-star-trainer"
                    className="block pl-3 pr-4 py-1 text-sm text-gray-600 hover:text-converse-red"
                  >
                    Run Star Trainer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

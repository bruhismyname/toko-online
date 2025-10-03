import Link from "next/link";
import { Store } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        <Link
          href="/"
          aria-label="ShoeStore Home"
          className="flex items-center gap-2 text-xl font-bold text-gray-900"
        >
          <Store className="h-6 w-6" />
          ShoeStore
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-6 text-sm md:flex">
          <Link href="/" className="text-gray-600 hover:text-black">
            Home
          </Link>
          <Link href="/products" className="text-gray-900 hover:text-black">
            Products
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex gap-3 text-sm">
          <Link
            href="/auth/login"
            className="rounded-lg bg-black px-3 py-2 font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-black px-3 py-2 font-semibold text-white transition hover:bg-gray-800"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

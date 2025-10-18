import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/common/Logo";
import { useNotification } from "@/components/context/NotificationContext";

const LoginView = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      rememberMe,
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login gagal");
      }

      showNotification("Login berhasil!", "success");

      // Jika user admin → redirect ke dashboard admin
      if (result.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // Jika ada pending cart item di localStorage
      const pendingCartItemStr = localStorage.getItem("pendingCartItem");
      if (pendingCartItemStr) {
        try {
          const pendingCartItem = JSON.parse(pendingCartItemStr);
          localStorage.removeItem("pendingCartItem");

          const cartRes = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: pendingCartItem.product_id,
              stock_id: pendingCartItem.stock_id,
              quantity: 1,
            }),
          });

          if (cartRes.ok) {
            showNotification("Item ditambahkan ke keranjang Anda!", "success");
          } else {
            showNotification("Gagal menambahkan item ke keranjang", "error");
          }

          router.push(pendingCartItem.redirect_url);
          return;
        } catch (err) {
          console.error("Error processing pending cart item:", err);
          showNotification("Terjadi kesalahan saat memproses keranjang", "error");
        }
      }

      // Jika bukan admin, arahkan ke home
      router.push("/");
    } catch (err: any) {
      setError(err.message);
      showNotification(err.message || "Login gagal", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-black">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Link>
          <div className="flex items-center">
            <Logo showText={false} />
          </div>
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Selamat Datang <br /> di Bakul Converse!
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Alamat Email"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Ingat saya
            </label>
            <Link href="/auth/forgot" className="text-gray-600 hover:text-black">
              Lupa password?
            </Link>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-medium text-black hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginView;

import Router from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Store, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const RegisterView = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Password dan Confirm Password tidak sama!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Register failed");
      }

      alert("Registrasi berhasil!");
      Router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-black">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <Store className="h-6 w-6 text-black" />
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
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

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;

import Router from "next/router";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Check, X } from "lucide-react";
import Logo from "@/components/common/Logo";

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
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Password validation checks
  const passwordChecks = {
    minLength: form.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(form.password),
    hasLowerCase: /[a-z]/.test(form.password),
    hasNumber: /\d/.test(form.password),
    hasSymbol: /[@$!%*?&]/.test(form.password),
  };

  // Email validation check
  const isGmailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email);

  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({
      ...touched,
      [field]: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateEmail(form.email)) {
      setError("Email harus menggunakan format Gmail yang valid (contoh: nama@gmail.com).");
      setLoading(false);
      return;
    }

    if (!validatePassword(form.password)) {
      setError(
        "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol."
      );
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Registrasi gagal");
      }

      alert("Registrasi berhasil!");
      Router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-xs ${isValid ? 'text-green-600' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center text-gray-500 hover:text-black">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Link>
          <Logo showText={false} />
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Daftar Akun <br /> Bakul Converse
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Nama Lengkap"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                required
                placeholder="Email (harus Gmail)"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            {touched.email && form.email && (
              <div className="mt-2 rounded-lg bg-gray-50 p-3">
                <ValidationItem 
                  isValid={isGmailValid} 
                  text="Harus menggunakan domain @gmail.com" 
                />
              </div>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
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
            {touched.password && form.password && (
              <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-3">
                <ValidationItem 
                  isValid={passwordChecks.minLength} 
                  text="Minimal 8 karakter" 
                />
                <ValidationItem 
                  isValid={passwordChecks.hasUpperCase} 
                  text="Mengandung huruf besar (A-Z)" 
                />
                <ValidationItem 
                  isValid={passwordChecks.hasLowerCase} 
                  text="Mengandung huruf kecil (a-z)" 
                />
                <ValidationItem 
                  isValid={passwordChecks.hasNumber} 
                  text="Mengandung angka (0-9)" 
                />
                <ValidationItem 
                  isValid={passwordChecks.hasSymbol} 
                  text="Mengandung simbol (@$!%*?&)" 
                />
              </div>
            )}
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Konfirmasi Password"
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

          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-xs text-red-500">Password dan Konfirmasi Password tidak sama</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-70"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-black hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
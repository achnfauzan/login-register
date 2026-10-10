"use client";

import { useState } from "react";
import Link from "next/link";

type UserData = {
  id: number;
  name: string;
  email: string;
};

type Info = { msg: string; isError: boolean } | null;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [info, setInfo] = useState<Info>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInfo(null);
    setLoggedInUser(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setInfo({ msg: data.error || "Gagal masuk", isError: true });
        return;
      }

      setInfo({
        msg: `Selamat datang kembali, ${data.user.name}!`,
        isError: false,
      });
      setLoggedInUser(data.user);
    } catch {
      setInfo({ msg: "Tidak dapat terhubung ke server", isError: true });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Masuk ke Akun
        </h2>

        {info && (
          <div
            className={`mb-4 rounded p-3 text-sm ${
              info.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {info.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputClass}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>

        {loggedInUser && (
          <div className="mt-4 rounded border bg-gray-50 p-3 text-xs text-gray-700">
            <p className="mb-1 font-semibold text-gray-900">Status: Berhasil Login</p>
            <p>ID: {loggedInUser.id}</p>
            <p>Nama: {loggedInUser.name}</p>
            <p>Email: {loggedInUser.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import PublicRoute from "@/components/auth/PublicRoute";

export default function ResetPasswordPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setMessage(data.message);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicRoute>
    <main
      className="flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/poster1.jpg')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-96 space-y-4 rounded border p-8"
      >
        <h1 className="text-2xl font-bold">
          Reset Password
        </h1>

        <p className="text-sm">
          Enter your new password below.
        </p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          className="w-full rounded border p-2"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
          className="w-full rounded border p-2"
        />

        <div className="min-h-10">
          {error && (
            <p className="rounded-lg bg-red-100 p-3 font-bold text-red-500">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-lg bg-green-100 p-3 font-bold text-green-700">
              {message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-black p-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push("/login")
          }
          className="w-full text-sm underline cursor-pointer"
        >
          Back to Login
        </button>
      </form>
    </main>
    </PublicRoute>
  );
}
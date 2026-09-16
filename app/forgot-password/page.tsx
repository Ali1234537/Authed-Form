"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import PublicRoute from "@/components/auth/PublicRoute";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);
    } catch {
      setMessage(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicRoute>
    <main className="flex min-h-screen items-center justify-center bg-cover bg-center"
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
          Forgot Password
        </h1>

        <p className="text-sm">
          Enter your email and we will send
          you a password reset link.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          autoFocus
          className="w-full rounded border p-2"
        />

        <div className="min-h-10">
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
              Sending...
            </>
          ) : (
            "Send Reset Link"
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
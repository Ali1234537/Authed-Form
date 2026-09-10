"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Loader } from "lucide-react";

import { useAppDispatch } from "@/redux/hooks";


import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";

import PublicRoute from "@/components/auth/PublicRoute";

export default function LoginPage() {

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [email, setEmail] =useState("");

  const [password, setPassword] =useState("");

  const [error, setError] =useState("");

  const [loading, setLoading] =useState(false);

  async function handleLogin(
    event: React.FormEvent
  ) {

    event.preventDefault();

    setError("");
    setLoading(true);

    dispatch(loginStart());

    try {

      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(data.message);

        dispatch(
          loginFailed(data.message)
        );

        setLoading(false);

        return;
      }

      dispatch(
        loginSuccess(data.user)
      );
      
      setLoading(false)

      router.push("/dashboard");

    } catch {

      setError(
        "Something went wrong."
      );

      dispatch(
        loginFailed(
          "Something went wrong."
        )
      );

      setLoading(false);
    }
  }

  return (
    <PublicRoute>

      <main className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/poster1.jpg')" }}>

        <form
          onSubmit={handleLogin}
          className="w-96 space-y-4 rounded border p-8"
        >

          <h1 className="text-2xl font-bold">
            Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded border p-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded border p-2"
          />

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded bg-black p-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >

            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}

          </button>
          

          <button
            type="button"
            onClick={() =>
              router.push("/register")
            }
            className="w-full text-sm underline cursor-pointer"
          >
            Don't have an account?
            <strong> Register </strong>
          </button>

        </form>

      </main>

    </PublicRoute>
  );
}
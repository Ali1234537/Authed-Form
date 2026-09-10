"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import{Loader} from "lucide-react";

import PublicRoute from "@/components/auth/PublicRoute";


export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  
  const[loading , setIsLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true)
    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      setIsLoading(false)
      return;
    }

    router.push("/login");
  }

  return (
    <PublicRoute> 
    <main className="flex min-h-screen items-center justify-center bg-cover bg-center"
     style={{ backgroundImage: "url('/poster1.jpg')" }}>
      <form
        onSubmit={handleRegister}
        className="w-96 space-y-4 rounded border p-8"
      >
        <h1 className="text-2xl font-bold">
          Register
        </h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full rounded border p-2  "
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded border p-2  "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full rounded border p-2  "
        />

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled = {loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-black p-2 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
        {loading ? (
          <>
           <Loader  className="w-5 h-5 animate-spin"/>
           Registering ...
          </>
        ):(
          "Register"
        )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full text-sm underline cursor-pointer"
        >
          Already have an account? <strong> Login </strong>
        </button>
      </form>
     </main>
    </PublicRoute> 
  );
}
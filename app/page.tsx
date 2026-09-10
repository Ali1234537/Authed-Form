import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/poster1.jpg')" }}>
       <div className="text-center">
        <h1 className="text-3xl font-bold">
          Authentication Form
        </h1>

        <p className="mt-3">
          Access to the Dashboard ?
        </p>

        <div className="mt-6 space-x-3">
          <Link
            href="/login"
            className="rounded bg-white px-5 py-2 text-black  border-2  hover:brightness-90 hover:border-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded  bg-white  text-black   border-2  px-5 py-2 hover:brightness-90 hover:border-white"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
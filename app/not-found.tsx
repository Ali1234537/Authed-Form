import Link from "next/link";
import {ArrowLeft} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-red-700">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white">
          401
        </h1>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Access Denied! 
        </h2>

      
        <Link
          href="/login"
          className="mt-5  inline-flex items-center gap-2 rounded bg-red-500 px-5 py-2 text-white border-2 border-white hover:bg-red-400 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 hover:text-black"
        >
          <ArrowLeft  size={18}/>
          LogIn
        </Link>
      </div>
    </main>
  );
}


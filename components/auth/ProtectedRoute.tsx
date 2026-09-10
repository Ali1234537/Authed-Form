"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader } from "lucide-react";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import { loginSuccess } from "@/redux/slices/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector(
    (state) => state.auth.user
  );

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch(
          "/api/auth/indiv"
        );

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        dispatch(loginSuccess(data.user));
      } catch {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    }

    if (!user) {
      checkUser();
    } else {
      setChecking(false);
    }
  }, [user, dispatch, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
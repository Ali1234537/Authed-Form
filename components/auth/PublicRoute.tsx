"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
 
interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({
  children,
}: PublicRouteProps) {
  const router = useRouter();

   

  const [checking, setChecking]=useState(true);

  // This is the useEffect that check whether the user has valid 
  // token by calling this "/api/auth/indiv"
  // and if the response (token exists) is OK then router.replace("/dashboard") 
  
  useEffect(() => {
    async function checkUser() {
      try {
        const response = await fetch(
          "/api/auth/indiv"
        );

        if (response.ok) {
          router.replace("/dashboard");
          return;
        }

        setChecking(false);
      } catch {
        setChecking(false);
      }
    }


    checkUser();
  }, [router]);

  if (checking) {
    return null;
  }

  return <>{children}</>;
}
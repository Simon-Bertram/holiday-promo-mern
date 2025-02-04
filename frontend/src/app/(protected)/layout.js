"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({ children }) {
  const { isAuthorized, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // useAuth hook handles redirect
  }

  return <>{children}</>;
}

"use client";

import { useRoleAuth } from "@/hooks/useRoleAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthorized, isLoading } = useRoleAuth(["admin", "moderator"]);

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthorized, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return <div>Dashboard</div>;
}
